const nodemailer = require("nodemailer");
const { verifyToken } = require("../../middleware/verifyToken");
const db = require("../../db");
const util = require('util');
const { Activity_log, Remind, SendWhatsappMessage } = require("../utils/util");
const query = util.promisify(db.query).bind(db);
const schedule = require('node-schedule');

const dateToCron = (date) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

exports.createAppointment = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, { verifyUser: true });
        let { employee_id = getUser, client_id, subject, client_or_other_name, phone, email, appointment_date, remark } = req.body;
        if(employee_id == "", employee_id == null){
            employee_id = getUser;
        }
        const getSelectedUser = await query("select * from users where id = ?", [employee_id]);
        if(client_id == "" || client_id == null){
            client_id = null;
        }
        const client_name = await query("select * from tbl_customer where id = ?", [client_id]);
        if(client_or_other_name == "" || client_or_other_name == null){
            client_or_other_name = client_name[0].company;
        }
        const emp = await query("select * from users where id = ?", [employee_id]);
        const sql = `
            INSERT INTO tbl_appoinment (employee_id, client_id, subject, client_or_other_name, phone, email, appoinment_date, remark, addedfrom) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const appoinemnt = await query(sql, [employee_id, client_id, subject, client_or_other_name, phone, email, appointment_date, remark, getUser]);
        const getAppointment = await query("select * from tbl_appoinment where id = ?", [appoinemnt.insertId]);
        
        // adding activity log
        req.body.description = `Added appoinment of employee id: [${employee_id}], name: [${emp[0].full_name}] with client id: [${client_id}], client comapny: [${client_or_other_name}]`;
        await Activity_log(req, res, next);
        const reminderDate = new Date(appointment_date);
        if (isNaN(reminderDate)) {
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }
        console.log("reminderDate", reminderDate);
        // Subtract 2 hours (2 * 60 * 60 * 1000 milliseconds)
        const beforeDate = new Date(reminderDate.getTime() - 2 * 60 * 60 * 1000);
        console.log(`Reminder date and time: ${reminderDate}`)
        
        Remind(req, res, next, {from: "beforeDate", date: beforeDate, remind: reminderDate, name: getSelectedUser[0].full_name, email: getSelectedUser[0].email, client: client_or_other_name});
        Remind(req, res, next, {from: "appointment", date: reminderDate, name: getSelectedUser[0].full_name, email: getSelectedUser[0].email, client: client_or_other_name});
        const cronDate = dateToCron(reminderDate);
        schedule.scheduleJob(cronDate, async () => {
            if(getSelectedUser[0].phone){
                req.body.from = "appointment";
                req.body.phone = getSelectedUser[0].phone;
                req.body.name = getSelectedUser[0].full_name;
                req.body.date = reminderDate;
                req.body.client = client_or_other_name;
                SendWhatsappMessage(req, res, next);
            }
        });
        return res.status(201).json({ success: true, message: "Appointment created successfully", data: getAppointment });
    } catch (error) {
        console.log("Error in createAppointment", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAppointments = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, { verifyUser: true });
        const sql = `
            select * from tbl_appoinment where employee_id = ? and completed = ?;
        `;
        const get = await query(sql, [getUser, false]);

        return res.status(201).json({ success: true, message: "Appointment fetched successfully", data: get });
    } catch (error) {
        console.log("Error in getAppointments", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAppointmentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const sql = `
            select * from tbl_appoinment where id = ?;
        `;
        const get = await query(sql, [id]);

        return res.status(201).json({ success: true, message: "Appointment fetched successfully", data: get });
    } catch (error) {
        console.log("Error in getAppointmentById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateAppointment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const getUser = await verifyToken(req, res, next, { verifyUser: true });
        let { employee_id, client_id, subject, client_or_other_name, phone, email, appointment_date, remark } = req.body;
        if(employee_id == "", employee_id == null){
            employee_id = getUser;
        }
        if(client_id == "" || client_id == null){
            client_id = null;
        }
        date = new Date(appointment_date);
        const client_name = await query("select * from tbl_customer where id = ?", [client_id]);
        if(client_or_other_name == "" || client_or_other_name == null){
            client_or_other_name = client_name[0].company;
        }
        const emp = await query("select * from users where id = ?", [employee_id]);
        const sql = `
            UPDATE tbl_appoinment
            SET employee_id=?, client_id=?, subject=?, client_or_other_name=?, phone=?, email=?, appoinment_date=?, remark=?, addedfrom=?
            WHERE id=?;
        `;
        const appoinemnt = await query(sql, [employee_id, client_id, subject, client_or_other_name, phone, email, date, remark, getUser, id]);
        console.log("appoinemnt", appoinemnt);
        const getAppointment = await query("select * from tbl_appoinment where id = ?", [id]);
        
        // adding activity log
        req.body.description = `Updated appoinment employee id: [${employee_id}], name: [${emp[0].full_name}] with client id: [${client_id}], client comapny: [${client_or_other_name}]`;
        await Activity_log(req, res, next);

        return res.status(201).json({ success: true, message: "Appointment updated successfully", data: getAppointment });
    } catch (error) {
        console.log("Error in createAppointment", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        await query("DELETE FROM tbl_appoinment WHERE id=?", [id]);

        return res.status(200).json({ success: true, message: "Appointment deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAppointment", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.CompleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        await query("update tbl_appoinment set completed = ? WHERE id = ?", [true, id]);

        return res.status(200).json({ success: true, message: "Appointment completed successfully" });
    } catch (error) {
        console.log("Error in CompleteAppointment", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}