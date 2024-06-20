const nodemailer = require("nodemailer");
const { verifyToken } = require("../../middleware/verifyToken");
const db = require("../../db");
const util = require('util');
const { getColumn, CustomFieldValue, Activity_log } = require("../utils/util");

const query = util.promisify(db.query).bind(db);

exports.createCustomer = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, { verifyUser: true });
        const getSelectedUser = await query("select * from users where id = ?", [getUser]);
        const { company, primary_contact, email, vat, phone, website, in_groups, currency, default_language, address, city, state, zip, country, it_status, master_type, pan_no, gstin, aadhar_no, incorporation_date_from, incorporation_date_to, licence_no, licence_authority, trn_no, description, support_employee } = req.body;
        const sql = `
            INSERT INTO tbl_customer (
                company, primary_contact, email, vat, phone, website, in_groups, currency, default_language, address, city, state, zip, country, addedfrom, it_status, master_type, pan_no, gstin, aadhar_no, incorporation_date_from, incorporation_date_to, licence_no, licence_authority, trn_no, description, support_employee, company_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const getCustomer = await query(sql, [company, primary_contact, email, vat, phone, website, in_groups, currency, default_language, address, city, state, zip, country, getUser, it_status, master_type, pan_no, gstin, aadhar_no, incorporation_date_from, incorporation_date_to, licence_no, licence_authority, trn_no, description, support_employee, getSelectedUser[0].company_id]);
        const getInsertedCustomer = await query("select * from tbl_customer where id = ?", [getCustomer.insertId])

        const Column = await getColumn(req, res, next, "tbl_customer");
            console.log("Column", Column);
            let missingFields = [];
            if (Column != undefined && Column && Column.length > 0) {
                for (const element of Column) {
                    const value = req.body[element.name];
                    console.log("value", value);
                    if(element.required){
                        if (!value || value == undefined) {
                            missingFields.push(`Give value to custom field ${element.name}`);
                        }else{
                            await CustomFieldValue(req, res, next, getCustomer.insertId, element.id, element.fieldto, value);    
                        }  
                    }else {
                        if (value && value != undefined) {
                            await CustomFieldValue(req, res, next, getCustomer.insertId, element.id, element.fieldto, value);
                        }
                    }
                }
            }

            if (missingFields.length > 0) {
                req.body.id = getCustomer.insertId;
                await this.deleteCustomer(req, res, next);
                return res.status(200).json({ success: false, message: missingFields.join(", ") });
            } else {
                req.body.description = `Customer added successfully. company name is [${company}] and id: [${getCustomer.insertId}] `;
                await Activity_log(req, res, next);
                return res.status(201).json({ success: true, message: "Customer created successfully", data: getInsertedCustomer });
            }
    } catch (error) {
        console.log("Error in createCustomer", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getCustomers = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, { verifyUser: true });
        const getSelectedUser = await query("select * from users where id = ?", [getUser]);
        const sql = "SELECT * FROM tbl_customer where company_id = ?";
        const customer = await query(sql, [getSelectedUser[0].company_id]);
        if (customer.length === 0) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        return res.status(200).json({ success: true, data: customer });
    } catch (error) {
        console.log("Error in getCustomerById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM tbl_customer WHERE id = ?;";
        const customer = await query(sql, [id]);
        if (customer.length === 0) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        return res.status(200).json({ success: true, data: customer });
    } catch (error) {
        console.log("Error in getCustomerById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { company, primary_contact, email, vat, phone, website, in_groups, currency, default_language, address, city, state, zip, country, it_status, master_type, pan_no, gstin, aadhar_no, incorporation_date_from, incorporation_date_to, licence_no, licence_authority, trn_no, description, support_employee } = req.body;
        const sql = `
            UPDATE tbl_customer 
            SET company=?, primary_contact=?, email=?, vat=?, phone=?, website=?, in_groups=?, currency=?, default_language=?, address=?, city=?, state=?, zip=?, country=?, it_status=?, master_type=?, pan_no=?, gstin=?, aadhar_no=?, incorporation_date_from=?, incorporation_date_to=?, licence_no=?, licence_authority=?, trn_no=?, description=?, support_employee=?
            WHERE id=?;
        `;
        const Column = await getColumn(req, res, next, "tbl_customer");
            console.log("Column", Column);
            let missingFields = [];
            if (Column != undefined && Column && Column.length > 0) {
                for (const element of Column) {
                    const value = req.body[element.name];
                    console.log("value", value);
                    if(element.required){
                        if (!value || value == undefined) {
                            missingFields.push(`Give value to custom field ${element.name}`);
                        }else{
                            await CustomFieldValue(req, res, next, id, element.id, element.fieldto, value, "update", element.name);
                        }  
                    }else {
                        if (value && value != undefined) {
                            await CustomFieldValue(req, res, next, id, element.id, element.fieldto, value, "update", element.name);
                        }
                    }
                }
            }

            if (missingFields.length > 0) {
                req.body.id = id;
                return res.status(200).json({ success: false, message: missingFields.join(", ") });
            }
        await query(sql, [company, primary_contact, email, vat, phone, website, in_groups, currency, default_language, address, city, state, zip, country, it_status, master_type, pan_no, gstin, aadhar_no, incorporation_date_from, incorporation_date_to, licence_no, licence_authority, trn_no, description, support_employee, id]);
        req.body.description = `Customer updated successfully. company name is [${company}] and id: [${id}] `;
        await Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Customer updated successfully" });
    } catch (error) {
        console.log("Error in updateCustomer", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteCustomer = async (req, res, next) => {
    try {
        const id = req.params.id?req.params.id:req.body.id;
        if(!id){
            return res.status(400).json({ success: false, message: "No id provided" });
        }
        const sql = "DELETE FROM tbl_customer WHERE id = ?;";
        await query(sql, [id]);
        if(req.body.id){
            return
        }else{
            return res.status(200).json({ success: true, message: "Customer deleted successfully" });
        }
    } catch (error) {
        console.log("Error in deleteCustomer", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
