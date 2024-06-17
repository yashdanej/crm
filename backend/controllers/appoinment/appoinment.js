const nodemailer = require("nodemailer");
const { verifyToken } = require("../../middleware/verifyToken");
const db = require("../../db");
const util = require('util');
const query = util.promisify(db.query).bind(db);

exports.createAppointment = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, { verifyUser: true });
        const { employee_id = getUser, client_id, subject, client_or_other_name, phone, email, appointment_date, remark } = req.body;
        console.log("employee_id", employee_id);
        const sql = `
            INSERT INTO tbl_appoinment (employee_id, client_id, subject, client_or_other_name, phone, email, appoinment_date, remark) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await query(sql, [employee_id, client_id, subject, client_or_other_name, phone, email, appointment_date, remark]);

        return res.status(201).json({ success: true, message: "Appointment created successfully" });
    } catch (error) {
        console.log("Error in createAppointment", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};