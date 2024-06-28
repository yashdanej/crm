const { verifyToken } = require("../../middleware/verifyToken");
const db = require('../../db');
const util = require('util');
const cloudinary = require("../utils/cloudinary");

const query = util.promisify(db.query).bind(db);

// tbltasks

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
            name, description, priority, new Date(), new Date(startdate), duedate, datefinished, getUser,
            is_added_from_contact, status, recurring_type, repeat_every, recurring, is_recurring_from,
            cycles, total_cycles, custom_recurring, last_recurring_date, rel_id, rel_type, is_public,
            billable, billed, invoice_id, hourly_rate, milestone, kanban_order, milestone_order,
            visible_to_client, deadline_notified, getSelecteduser[0].company_id
        ];


        const result = await query(sql, values);

        const newTask = await query("SELECT * FROM tbltasks WHERE id = ?", [result.insertId]);
        return res.status(201).json({ success: true, message: "Task created successfully", data: newTask });
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

exports.updateStatusTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.params;
        console.log("id, status", id, status);

        const sql = `
            UPDATE tbltasks SET status = ? WHERE id = ?
        `;

        await query(sql, [ status, id ]);

        const updatedSTask = await query("SELECT * FROM tbltasks WHERE id = ?", [id]);
        console.log("update");
        return res.status(200).json({ success: true, message: "Task updated successfully", data: updatedSTask });
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

// ---------------------------------------------------------------------------------------------------------------
// tbltask_assigned

// Create a new task assignment
exports.createTaskAssigned = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { staffid, taskid, is_assigned_from_contact } = req.body;
        
        // Ensure staffid is a non-empty string and split it into an array of integers
        if (typeof staffid !==  'string' || staffid.trim() === '') {
            return res.status(400).json({ success: false, message: 'Staff IDs must be a non-empty comma-separated string' });
        }
        
        const staffIdsArray = staffid.split(',').map(id => parseInt(id.trim(), 10));
        if (staffIdsArray.some(isNaN)) {
            return res.status(400).json({ success: false, message: 'Invalid staff ID format' });
        }
        const getSelectedUser = await query("select * from users where id = ?", [getUser]);

        const validationResults = await Promise.all(staffIdsArray.map(async (element) => {
            const getStaff = await query("select * from users where id = ? and company_id = ?", [element, getSelectedUser[0].company_id]);
            return { id: element, exists: getStaff.length > 0 };
        }));

        const invalidStaff = validationResults.filter(result => !result.exists);

        if (invalidStaff.length > 0) {
            return res.status(404).json({ success: false, message: `IDs not found: ${invalidStaff.map(item => item.id).join(', ')}` });
        }
        console.log("staffIdsArray", staffIdsArray);

        const sql = `
            INSERT INTO tbltask_assigned (staffid, taskid, assigned_from, is_assigned_from_contact)
            VALUES ?
        `;

        // Prepare values for bulk insertion
        const values = staffIdsArray.map(id => [id, taskid, getUser, is_assigned_from_contact]);
        console.log("values", values);
        // Execute the query
        const result = await query(sql, [values]);
        res.status(201).json({ success: true, message: 'Task assignments created successfully', affectedRows: result.affectedRows });
    } catch (error) {
        console.error('Error in createTaskAssigned:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get a task assignment by id
exports.getTaskAssignedById = async (req, res) => {
    try {
        console.log("w");
        const { id } = req.params;
        const sql = 'SELECT * FROM tbltask_assigned WHERE id = ?';
        const result = await query(sql, [id]);
        if (result.length > 0) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(404).json({ success: false, message: 'Task assignment not found' });
        }
    } catch (error) {
        console.error('Error in getTaskAssignedById:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all task assignments
exports.getAllTaskAssigned = async (req, res) => {
    try {
        const { taskid } = req.params;
        const sql = 'SELECT * FROM tbltask_assigned where taskid = ?';
        const result = await query(sql, [taskid]);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error in getAllTaskAssigned:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update a task assignment
exports.updateTaskAssigned = async (req, res, next) => {
    try {
        console.log("inn-------");
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { taskid } = req.params;
        const { staffid, is_assigned_from_contact } = req.body;
        console.log("staffid", staffid);

        // Ensure staffid is a non-empty string and split it into an array of integers
        if (typeof staffid !== 'string' || staffid.trim() === '') {
            return res.status(400).json({ success: false, message: 'Staff IDs must be a non-empty comma-separated string' });
        }

        const staffIdsArray = staffid.split(',').map(id => parseInt(id.trim(), 10));
        if (staffIdsArray.some(isNaN)) {
            return res.status(400).json({ success: false, message: 'Invalid staff ID format' });
        }

        // Remove existing assignments for the specified task
        const deleteSql = 'DELETE FROM tbltask_assigned WHERE taskid = ?';
        await query(deleteSql, [taskid]);

        const getSelectedUser = await query("select * from users where id = ?", [getUser]);

        const validationResults = await Promise.all(staffIdsArray.map(async (element) => {
            const getStaff = await query("select * from users where id = ? and company_id = ?", [element, getSelectedUser[0].company_id]);
            return { id: element, exists: getStaff.length > 0 };
        }));

        const invalidStaff = validationResults.filter(result => !result.exists);

        if (invalidStaff.length > 0) {
            return res.status(404).json({ success: false, message: `IDs not found: ${invalidStaff.map(item => item.id).join(', ')}` });
        }

        // Prepare values for bulk insertion of the updated assignments
        const insertSql = `
            INSERT INTO tbltask_assigned (staffid, taskid, assigned_from, is_assigned_from_contact)
            VALUES ?
        `;
        const values = staffIdsArray.map(id => [id, taskid, getUser, is_assigned_from_contact]);

        // Execute the query for bulk insertion
        const result = await query(insertSql, [values]);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Task assignments updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'No task assignments were updated' });
        }
    } catch (error) {
        console.error('Error in updateTaskAssigned:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete a task assignment
exports.deleteTaskAssigned = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM tbltask_assigned WHERE id = ?';
        const result = await query(sql, [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Task assignment deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Task assignment not found' });
        }
    } catch (error) {
        console.error('Error in deleteTaskAssigned:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// ------------------------------------------------------------------------------------------------
// tbltask_followers

// Create task followers
exports.createTaskFollowers = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { staffid, taskid } = req.body;

        // Ensure staffid is a non-empty string and split it into an array of integers
        if (typeof staffid !== 'string' || staffid.trim() === '') {
            return res.status(400).json({ success: false, message: 'Staff IDs must be a non-empty comma-separated string' });
        }

        const staffIdsArray = staffid.split(',').map(id => parseInt(id.trim(), 10));
        if (staffIdsArray.some(isNaN)) {
            return res.status(400).json({ success: false, message: 'Invalid staff ID format' });
        }

        const getSelectedUser = await query("select * from users where id = ?", [getUser]);

        const validationResults = await Promise.all(staffIdsArray.map(async (element) => {
            const getStaff = await query("select * from users where id = ? and company_id = ?", [element, getSelectedUser[0].company_id]);
            return { id: element, exists: getStaff.length > 0 };
        }));

        const invalidStaff = validationResults.filter(result => !result.exists);

        if (invalidStaff.length > 0) {
            return res.status(404).json({ success: false, message: `IDs not found: ${invalidStaff.map(item => item.id).join(', ')}` });
        }

        const sql = `
            INSERT INTO tbltask_followers (staffid, taskid)
            VALUES ?
        `;

        // Prepare values for bulk insertion
        const values = staffIdsArray.map(id => [id, taskid]);

        // Execute the query for bulk insertion
        const result = await query(sql, [values]);
        res.status(201).json({ success: true, message: 'Task followers created successfully', affectedRows: result.affectedRows });
    } catch (error) {
        console.error('Error in createTaskFollowers:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update task followers
exports.updateTaskFollowers = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { taskid } = req.params;
        const { staffid } = req.body;

        // Ensure staffid is a non-empty string and split it into an array of integers
        if (typeof staffid !== 'string' || staffid.trim() === '') {
            return res.status(400).json({ success: false, message: 'Staff IDs must be a non-empty comma-separated string' });
        }

        const staffIdsArray = staffid.split(',').map(id => parseInt(id.trim(), 10));
        if (staffIdsArray.some(isNaN)) {
            return res.status(400).json({ success: false, message: 'Invalid staff ID format' });
        }

        // Remove existing followers for the specified task
        const deleteSql = 'DELETE FROM tbltask_followers WHERE taskid = ?';
        await query(deleteSql, [taskid]);

        const getSelectedUser = await query("select * from users where id = ?", [getUser]);

        const validationResults = await Promise.all(staffIdsArray.map(async (element) => {
            const getStaff = await query("select * from users where id = ? and company_id = ?", [element, getSelectedUser[0].company_id]);
            return { id: element, exists: getStaff.length > 0 };
        }));

        const invalidStaff = validationResults.filter(result => !result.exists);

        if (invalidStaff.length > 0) {
            return res.status(404).json({ success: false, message: `IDs not found: ${invalidStaff.map(item => item.id).join(', ')}` });
        }

        // Prepare values for bulk insertion of the updated followers
        const insertSql = `
            INSERT INTO tbltask_followers (staffid, taskid)
            VALUES ?
        `;
        const values = staffIdsArray.map(id => [id, taskid]);

        // Execute the query for bulk insertion
        const result = await query(insertSql, [values]);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Task followers updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'No task followers were updated' });
        }
    } catch (error) {
        console.error('Error in updateTaskFollowers:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get task followers
exports.getTaskFollowers = async (req, res) => {
    try {
        const { taskid } = req.params;
        const sql = `
            SELECT * FROM tbltask_followers
            WHERE taskid = ?
        `;
        const followers = await query(sql, [taskid]);
        
        if (followers.length > 0) {
            res.status(200).json({ success: true, data: followers });
        } else {
            res.status(200).json({ success: false, message: 'No followers found for this task' });
        }
    } catch (error) {
        console.error('Error in getTaskFollowers:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// ------------------------------------------------------------------------------------------------
// tbltask_comments

// Create task comment
exports.createTaskComment = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { content, taskid, staffid, file } = req.body;
        const dateadded = new Date();

        const getTask = await query("select * from tbltasks where id = ?", [taskid]);

        let file_result;
        if(req.file &&  req.file.path){
            file_result = await cloudinary.uploader.upload(req.file.path, {
                folder: "crm",
                resource_type: "auto"
            });
            console.log("result", file_result);
        }

        const sql = `
            INSERT INTO tbltask_comments (content, taskid, staffid, dateadded, file)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [content, taskid, getUser, dateadded, file_result?.secure_url || null];
        const result = await query(sql, values);

        const selectResult = await query("select * from tbltask_comments where id = ?", [result.insertId]);

        res.status(201).json({ success: true, message: 'Comment added successfully', data: selectResult });
    } catch (error) {
        console.error('Error in createTaskComment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// get task comments
exports.getTaskComments = async (req, res) => {
    try {
        const { taskid } = req.params;
        const sql = `
            SELECT * FROM tbltask_comments WHERE taskid = ?
        `;
        const comments = await query(sql, [taskid]);

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error('Error in getTaskComments:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete task comment
exports.deleteTaskComment = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { id } = req.params;

        const sql = `
            DELETE FROM tbltask_comments
            WHERE id = ? AND staffid = ?
        `;
        const result = await query(sql, [id, getUser]);
        console.log("result", result);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Comment deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Comment not found or not authorized to delete' });
        }
    } catch (error) {
        console.error('Error in deleteTaskComment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// ------------------------------------------------------------------------------------------------
// tbltasktimers

// Start time
exports.startTaskTimer = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { task_id, hourly_rate, note } = req.body;
        console.log("req.body", req.body);
        console.log("task_id", task_id);
        const start_time = new Date().toISOString();

        const sql = `
            INSERT INTO tbltaskstimers (task_id, start_time, staff_id, hourly_rate, note)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [task_id, start_time, getUser, hourly_rate || 0.00, note || null];
        const result = await query(sql, values);

        const getResult = await query("select * from tbltaskstimers where id = ?", [result.insertId]);

        res.status(201).json({ success: true, message: 'Timer started successfully', data: getResult });
    } catch (error) {
        console.error('Error in startTaskTimer:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// End time
exports.endTaskTimer = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { id } = req.params; // The timer ID
        const end_time = new Date().toISOString();

        // Ensure the timer belongs to the user
        const checkSql = `
            SELECT * FROM tbltaskstimers WHERE id = ? AND staff_id = ?
        `;
        const timer = await query(checkSql, [id, getUser]);

        if (timer.length === 0) {
            return res.status(404).json({ success: false, message: 'Timer not found or not authorized to end' });
        }

        const sql = `
            UPDATE tbltaskstimers
            SET end_time = ?
            WHERE id = ?
        `;
        const result = await query(sql, [end_time, id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Timer ended successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Timer not found' });
        }
    } catch (error) {
        console.error('Error in endTaskTimer:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get timer for task / user / id
exports.getTaskTimers = async (req, res, next) => {
    try {
        const { task_id, staff_id, id } = req.query;
        console.log("req.query", req.query);
        let sql = 'SELECT * FROM tbltaskstimers WHERE 1=1';
        let values = [];

        if (id) {
            sql += ' AND id = ?';
            values.push(id);
        }

        if (task_id) {
            sql += ' AND task_id = ?';
            values.push(task_id);
        }

        if (staff_id) {
            sql += ' AND staff_id = ?';
            values.push(staff_id);
        }

        // Execute the query
        const timers = await query(sql, values);

        res.status(200).json({ success: true, data: timers });
    } catch (error) {
        console.error('Error in getTaskTimers:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// ------------------------------------------------------------------------------------------------
// tbltask_checklist_items

// create check list item
exports.createChecklistItem = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { taskid, description, list_order, assigned } = req.body;
        const dateadded = new Date();
        const getTask = await query("select * from tbltasks where id = ?", [taskid]);
        if(getTask.length === 0){
            return res.status(404).json({success: false, message: "No task found!"});
        }
        const sql = `
            INSERT INTO tbltask_checklist_items (taskid, description, finished, dateadded, addedfrom, finished_from, list_order, assigned)
            VALUES (?, ?, 0, ?, ?, 0, ?, ?)
        `;
        const values = [taskid, description, dateadded, getUser, list_order || 0, assigned || null];
        const result = await query(sql, values);

        res.status(201).json({ success: true, message: 'Checklist item created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error in createChecklistItem:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get check list item
exports.getChecklistItems = async (req, res, next) => {
    try {
        const { taskid } = req.params;
        
        let sql = 'SELECT * FROM tbltask_checklist_items WHERE taskid = ?';
        
        const checklistItems = await query(sql, [taskid]);

        res.status(200).json({ success: true, data: checklistItems });
    } catch (error) {
        console.error('Error in getChecklistItems:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update checklist item
exports.updateChecklistItem = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { id } = req.params;
        if(!id){
            return res.status(404).json({success: false, message: "No id found!"});
        }
        const { description, finished, list_order, assigned } = req.body;

        const sql = `
            UPDATE tbltask_checklist_items
            SET description = ?, finished = ?, finished_from = ?, list_order = ?, assigned = ?
            WHERE id = ?
        `;
        const values = [description, finished, finished ? getUser : 0, list_order, assigned, id];
        const result = await query(sql, values);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Checklist item updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Checklist item not found' });
        }
    } catch (error) {
        console.error('Error in updateChecklistItem:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete check list item
exports.deleteChecklistItem = async (req, res, next) => {
    try {
        const { id } = req.params;

        const sql = `
            DELETE FROM tbltask_checklist_items WHERE id = ?
        `;
        const result = await query(sql, [id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Checklist item deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Checklist item not found' });
        }
    } catch (error) {
        console.error('Error in deleteChecklistItem:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// ------------------------------------------------------------------------------------------------
// tbltasks_checklist_templates

// Create checklist template
exports.createChecklistTemplate = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const { description } = req.body;
        const sql = 'INSERT INTO tbltasks_checklist_templates (description, user_id) VALUES (?, ?)';
        const result = await query(sql, [description, getUser]);
        res.status(201).json({ success: true, message: 'Checklist template created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error in createChecklistTemplate:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get checklist templates
exports.getChecklistTemplates = async (req, res) => {
    try {
        const { user_id } = req.params;
        const sql = 'SELECT * FROM tbltasks_checklist_templates where user_id = ?';
        const results = await query(sql, [user_id]);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error('Error in getChecklistTemplates:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete checklist template
exports.deleteChecklistTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM tbltasks_checklist_templates WHERE id = ?';
        const result = await query(sql, [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Checklist template deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Checklist template not found' });
        }
    } catch (error) {
        console.error('Error in deleteChecklistTemplate:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
