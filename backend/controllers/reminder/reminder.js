const util = require('util');
const { Activity_log, MailSend, SendWhatsappMessage, Remind } = require('../utils/util');
const db = require('../../db');
const schedule = require('node-schedule');
const { verifyToken } = require('../../middleware/verifyToken');

const query = util.promisify(db.query).bind(db);

exports.addReminder = async (req, res, next) => {
 try {
    const getUser = await verifyToken(req, res, next, verifyUser=true);
    const rel_id = req.params.rel_id;
    const { description, date, staff, rel_type, notify_by_email } = req.body;
    console.log("date", date);
    const addingReminder = await query("insert into tblreminders set ?", {
        description,
        date,
        rel_id,
        staff,
        rel_type,
        notify_by_email,
        creator: getUser
    });
    console.log("addingReminder", addingReminder);
    const getStaff = await query("select * from users where id = ?", [staff]);
    const getCreator = await query("select * from users where id = ?", [getUser]);
    const getLead = await query("select * from tblleads where id = ?", [rel_id]);
    console.log("getStaff", getStaff);
    if(addingReminder.affectedRows === 1){
        req.body.description = `Added reminder for lead id: [${rel_id}] and description: [${description}] and reminder date is [${date}]`;
        req.body.leadid = rel_id;
        await Activity_log(req, res, next);
        const reminderDate = new Date(date);
        if (isNaN(reminderDate)) {
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }
        Remind(req, res, next, {date: reminderDate, description: description, staff: getStaff[0], creator: getCreator[0], lead: getLead[0], reminder_id: addingReminder.insertId});
        // const setDate = date.split("T");
        // const setTime = setDate[1].split(".")[0];
        // console.log("setDate", setDate, "setTime", setTime);
        // req.body.full_name = getStaff[0].full_name;
        // req.body.date = setDate;
        // req.body.time = setTime;
        // req.body.description = description;
        // req.body.assigned = getCreator[0].full_name;
        // console.log(req.body);
        // await SendWhatsappMessage(req, res, next, "reminder")
        const reminderData = await query("select * from tblreminders where id = ?", [addingReminder.insertId]);
        return res.status(200).json({success: true, message: "Reminder added successfully", data: reminderData});
    }else{
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
 } catch (error) {
    console.log("error in addReminder", error);
 }
}

exports.getReminder = async (req, res, next) => {
    try {
        const rel_id = req.params.rel_id;
        const rel_type = req.params.rel_type;
        const getReminder = await query("select * from tblreminders where rel_id = ? and rel_type = ?", [rel_id, rel_type]);
        console.log("getReminder", getReminder);
        if(getReminder.length > 0){
            return res.status(200).json({success: true, message: "Reminder fetched successfully!", data: getReminder});
        }else{
            return res.status(200).json({success: true, message: "No reminder found!", data: []});
        }
     } catch (error) {
        console.log("error in getReminder", error);
     }
}