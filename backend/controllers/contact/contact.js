const db = require("../../db");
const { verifyToken } = require("../../middleware/verifyToken");
const cloudinary = require("../utils/cloudinary");
const util = require("util");
const { Activity_log } = require("../utils/util");
const query = util.promisify(db.query).bind(db);

exports.createContact = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, true);
        const getSelectedUser = await query("select * from users where id = ?", [getUser]);
        const {
            userid, is_primary, firstname, lastname, email, phonenumber, title,
            password, new_pass_key, new_pass_key_requested, email_verified_at, email_verification_key,
            email_verification_sent_at, last_ip, last_login, last_password_change, active,
            profile_image, direction, invoice_emails, estimate_emails, credit_note_emails,
            contract_emails, task_emails, project_emails, ticket_emails
        } = req.body;

        // Check if email or phone number already exists
        const checkSql = `SELECT id FROM tblcontacts WHERE (email = ? OR phonenumber = ?) and  userid = ?`;
        const existingContacts = await query(checkSql, [email, phonenumber, userid]);

        if (existingContacts.length > 0) {
            return res.status(200).json({ success: false, message: "Email or phone number already exists" });
        }
        let ipAddress;

        if (req.headers['x-forwarded-for']) {
            // 'x-forwarded-for' header can contain a comma-separated list of IP addresses
            ipAddress = req.headers['x-forwarded-for'].split(',').pop().trim();
        } else {
            ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
        }
        let result;
        if(req?.file?.path){
            result = await cloudinary.uploader.upload(req.file.path, {
                folder: "crm",
                resource_type: "auto"
            });
        }else{
            result = {secure_url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"};
        }
        const datecreated = new Date();
        if(is_primary == true){
            await query("update tblcontacts set is_primary = ? where is_primary = ?", [false, true]);
        }
        const sql = `
        INSERT INTO tblcontacts (
            userid, is_primary, firstname, lastname, email, phonenumber, title, datecreated, password, 
            new_pass_key, new_pass_key_requested, email_verified_at, email_verification_key, 
            email_verification_sent_at, last_ip, last_login, last_password_change, active, profile_image, 
            direction, invoice_emails, estimate_emails, credit_note_emails, contract_emails, task_emails, 
            project_emails, ticket_emails, addedfrom, company_id
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const contact = await query(sql, [
        userid, 
        is_primary, 
        firstname, 
        lastname, 
        email, 
        phonenumber, 
        title, 
        datecreated, 
        password, 
        new_pass_key, 
        new_pass_key_requested, 
        email_verified_at, 
        email_verification_key, 
        email_verification_sent_at, 
        ipAddress, 
        last_login, 
        new Date(), // Assuming this is the current date for 'last_password_change'
        active || true, 
        result.secure_url, // Assuming 'result.secure_url' contains the URL of the profile image
        direction, 
        invoice_emails, 
        estimate_emails, 
        credit_note_emails, 
        contract_emails, 
        task_emails, 
        project_emails, 
        ticket_emails, 
        getUser, // Assuming 'getUser' contains the ID of the user who added this contact
        getSelectedUser[0].company_id // Assuming 'getSelectedUser[0].company_id' contains the company ID
    ]);
        const getSelectedContact = await query("select * from tblcontacts where id = ?", [contact.insertId]);

        return res.status(201).json({ success: true, message: "Contact created successfully", data: getSelectedContact });
    } catch (error) {
        console.log("Error in createContact", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getContact = await query("select * from tblcontacts where id = ?", [id]);
        const {
            userid, is_primary, firstname, lastname, email, phonenumber, title,
            password, new_pass_key, new_pass_key_requested, email_verified_at, email_verification_key,
            email_verification_sent_at, last_ip, last_login, last_password_change, active,
            direction, invoice_emails, estimate_emails, credit_note_emails,
            contract_emails, task_emails, project_emails, ticket_emails
        } = req.body;

        // Check if email or phone number already exists and belongs to a different contact
        const checkSql = `SELECT id FROM tblcontacts WHERE (email = ? OR phonenumber = ?) AND id != ? and userid = ?`;
        const existingContacts = await query(checkSql, [email, phonenumber, id, getContact[0].userid]);

        if (existingContacts.length > 0) {
            return res.status(400).json({ success: false, message: "Email or phone number already exists" });
        }

        let fileUrl;
        if (req.file && req.file.path) {
            const file = await cloudinary.uploader.upload(req.file.path, {
                folder: "crm",
                resource_type: "auto"
            });
            fileUrl = file.secure_url;
        }

        // Construct the update query dynamically
        const fieldsToUpdate = [
            'userid = ?', 'is_primary = ?', 'firstname = ?', 'lastname = ?',
            'email = ?', 'phonenumber = ?', 'title = ?', 'password = ?',
            'new_pass_key = ?', 'new_pass_key_requested = ?', 'email_verified_at = ?',
            'email_verification_key = ?', 'email_verification_sent_at = ?', 'last_ip = ?',
            'last_login = ?', 'last_password_change = ?', 'active = ?', 'direction = ?',
            'invoice_emails = ?', 'estimate_emails = ?', 'credit_note_emails = ?',
            'contract_emails = ?', 'task_emails = ?', 'project_emails = ?', 'ticket_emails = ?'
        ];

        const valuesToUpdate = [
            userid, is_primary, firstname, lastname, email, phonenumber, title, password,
            new_pass_key, new_pass_key_requested, email_verified_at, email_verification_key,
            email_verification_sent_at, last_ip, last_login, last_password_change, active || true,
            direction, invoice_emails, estimate_emails, credit_note_emails,
            contract_emails, task_emails, project_emails, ticket_emails
        ];

        if (fileUrl) {
            fieldsToUpdate.push('profile_image = ?');
            valuesToUpdate.push(fileUrl);
        }

        const sql = `
            UPDATE tblcontacts
            SET ${fieldsToUpdate.join(', ')}
            WHERE id = ?;
        `;
        valuesToUpdate.push(id);

        const result = await query(sql, valuesToUpdate);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }
        const getSelectedContact = await query("select * from tblcontacts where id = ?", [id]);
        return res.status(200).json({ success: true, message: "Contact updated successfully", data: getSelectedContact });
    } catch (error) {
        console.log("Error in updateContact", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getContacts = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const getUser = await verifyToken(req, res, next, true);
        const getSelectedUser = await query("select * from users where id = ?", [getUser]);
        const sql = `
            SELECT * FROM tblcontacts where company_id = ? and userid = ?;
        `;
        const contacts = await query(sql, [getSelectedUser[0].company_id, customer_id]);

        return res.status(200).json({ success: true, message: "Contacts fetched successfully", data: contacts });
    } catch (error) {
        console.log("Error in getContacts", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getContactById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT * FROM tblcontacts WHERE id = ?;
        `;
        const contact = await query(sql, [id]);
        console.log("contact", contact);
        if (contact.length === 0) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }
        console.log("contact", contact);

        return res.status(200).json({ success: true, message: "Contact fetched successfully", data: contact });
    } catch (error) {
        console.log("Error in getContactById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sql = `
            DELETE FROM tblcontacts WHERE id = ?;
        `;
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        return res.status(200).json({ success: true, message: "Contact deleted successfully" });
    } catch (error) {
        console.log("Error in deleteContact", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

