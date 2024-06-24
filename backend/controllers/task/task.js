const { verifyToken } = require("../../middleware/verifyToken");
const db = require('../../db');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.createTask = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const getSelecteduser = await query("select * from users where id = ?", [getUser]);
        const {
            name, description, priority, dateadded, startdate, duedate, datefinished, addedfrom,
            is_added_from_contact, status, recurring_type, repeat_every, recurring, is_recurring_from,
            cycles, total_cycles, custom_recurring, last_recurring_date, rel_id, rel_type, is_public,
            billable, billed, invoice_id, hourly_rate, milestone, kanban_order, milestone_order,
            visible_to_client, deadline_notified
        } = req.body;

        const sql = `
            INSERT INTO tbltasks (
                name, description, priority, dateadded, startdate, duedate, datefinished, addedfrom,
                is_added_from_contact, status, recurring_type, repeat_every, recurring, is_recurring_from,
                cycles, total_cycles, custom_recurring, last_recurring_date, rel_id, rel_type, is_public,
                billable, billed, invoice_id, hourly_rate, milestone, kanban_order, milestone_order,
                visible_to_client, deadline_notified, company_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            name, description, priority, new Date(dateadded), new Date(startdate), duedate, datefinished, getUser,
            is_added_from_contact, status, recurring_type, repeat_every, recurring, is_recurring_from,
            cycles, total_cycles, custom_recurring, last_recurring_date, rel_id, rel_type, is_public,
            billable, billed, invoice_id, hourly_rate, milestone, kanban_order, milestone_order,
            visible_to_client, deadline_notified, getSelecteduser[0].company_id
        ];


        const result = await query(sql, values);

        const newTask = await query("SELECT * FROM tbltasks WHERE id = ?", [result.insertId]);
        return res.status(201).json({ success: true, message: "Task created successfully", data: newTask[0] });
    } catch (error) {
        console.error("Error in createTask:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAllTasks = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const getSelecteduser = await query("select * from users where id = ?", [getUser]);
        const tasks = await query("SELECT * FROM tbltasks where company_id = ?", [getSelecteduser[0].company_id]);
        return res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.log("Error in getAllTasks", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await query("SELECT * FROM tbltasks WHERE id = ?", [id]);

        if (task.length === 0) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        return res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.log("Error in getTaskById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, description, priority, startdate, duedate, datefinished, addedfrom,
            is_added_from_contact, status, recurring_type, repeat_every, recurring,
            is_recurring_from, cycles, total_cycles, custom_recurring, last_recurring_date,
            rel_id, rel_type, is_public, billable, billed, invoice_id, hourly_rate,
            milestone, kanban_order, milestone_order, visible_to_client, deadline_notified
        } = req.body;

        const sql = `
            UPDATE tbltasks SET
                name = ?, description = ?, priority = ?, startdate = ?, duedate = ?, datefinished = ?, 
                addedfrom = ?, is_added_from_contact = ?, status = ?, recurring_type = ?, repeat_every = ?, 
                recurring = ?, is_recurring_from = ?, cycles = ?, total_cycles = ?, custom_recurring = ?, 
                last_recurring_date = ?, rel_id = ?, rel_type = ?, is_public = ?, billable = ?, billed = ?, 
                invoice_id = ?, hourly_rate = ?, milestone = ?, kanban_order = ?, milestone_order = ?, 
                visible_to_client = ?, deadline_notified = ? 
            WHERE id = ?
        `;

        await query(sql, [
            name, description, priority, startdate, duedate, datefinished, addedfrom,
            is_added_from_contact, status, recurring_type, repeat_every, recurring,
            is_recurring_from, cycles, total_cycles, custom_recurring, last_recurring_date,
            rel_id, rel_type, is_public, billable, billed, invoice_id, hourly_rate,
            milestone, kanban_order, milestone_order, visible_to_client, deadline_notified, id
        ]);

        const updatedTask = await query("SELECT * FROM tbltasks WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Task updated successfully", data: updatedTask });
    } catch (error) {
        console.log("Error in updateTask", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await query("SELECT * FROM tbltasks WHERE id = ?", [id]);

        if (task.length === 0) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        await query("DELETE FROM tbltasks WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.log("Error in deleteTask", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
