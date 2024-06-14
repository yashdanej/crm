const nodemailer = require("nodemailer");
const { verifyToken } = require("../../middleware/verifyToken");
const db = require("../../db");
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.createCustomer = async (req, res, next) => {
    try {
        const { company, primary_contact, email, vat, phone, website, in_groups, currency, default_language, address, city, state, zip, country, addedfrom, it_status, master_type, pan_no, gstin, aadhar_no, incorporation_date_from, incorporation_date_to, licence_no, licence_authority, trn_no, description, support_employee } = req.body;
        const sql = `
            INSERT INTO tbl_customer (
                company, primary_contact, email, vat, phone, website, in_groups, currency, default_language, address, city, state, zip, country, addedfrom, it_status, master_type, pan_no, gstin, aadhar_no, incorporation_date_from, incorporation_date_to, licence_no, licence_authority, trn_no, description, support_employee
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await query(sql, [company, primary_contact, email, vat, phone, website, in_groups, currency, default_language, address, city, state, zip, country, addedfrom, it_status, master_type, pan_no, gstin, aadhar_no, incorporation_date_from, incorporation_date_to, licence_no, licence_authority, trn_no, description, support_employee]);
        return res.status(201).json({ success: true, message: "Customer created successfully" });
    } catch (error) {
        console.log("Error in createCustomer", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getCustomers = async (req, res, next) => {
    try {
        const sql = "SELECT * FROM tbl_customer;";
        const customer = await query(sql);
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
        await query(sql, [company, primary_contact, email, vat, phone, website, in_groups, currency, default_language, address, city, state, zip, country, it_status, master_type, pan_no, gstin, aadhar_no, incorporation_date_from, incorporation_date_to, licence_no, licence_authority, trn_no, description, support_employee, id]);
        return res.status(200).json({ success: true, message: "Customer updated successfully" });
    } catch (error) {
        console.log("Error in updateCustomer", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM tbl_customer WHERE id = ?;";
        await query(sql, [id]);
        return res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        console.log("Error in deleteCustomer", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
