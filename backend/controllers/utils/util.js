const nodemailer = require("nodemailer");
const { verifyToken } = require("../../middleware/verifyToken");
const axios = require("axios");
const db = require("../../db");
const util = require('util');
const schedule = require('node-schedule');

exports.getRoles = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const getRoles = await query("select * from tblroles where name != ?", ["dev_owner"]);
        console.log("getRoles", getRoles);
        if(getRoles.length > 0){
            return res.status(200).json({success: true, message: "Roles fetched successfully!", data: getRoles});
        }else{
            return res.status(200).json({success: true, message: "No role found!", data: []});
        }
     } catch (error) {
        console.log("error in getRoles", error);
     }
}

exports.dateToCron = (date) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

exports.Remind = (req, res, next, obj) => {
    console.log("clicked");
    console.log("obj", obj);
    const cronDate = this.dateToCron(obj.date);
    console.log("cronDate", cronDate);
    console.log("req.body.from", req.body.from);
    console.log("obj.from", obj.from);
    if(req.body.from == "reminder"){
        schedule.scheduleJob(cronDate, async () => {
            console.log("ran");
            req.body.date = obj.date;
            req.body.description = obj.description;
            req.body.staff = obj.staff;
            req.body.creator = obj.creator;
            req.body.from = "reminder";
            req.body.lead = obj.lead;
            req.body.id = obj.reminder_id;
            this.MailSend(req, res, next);
        });
    }else if(obj.from == "appointment"){
        schedule.scheduleJob(cronDate, async () => {
            req.body.date = obj.date;
            req.body.name = obj.name;
            req.body.from = "appointment_reminder";
            req.body.email = obj.email;
            req.body.client = obj.client;
            this.MailSend(req, res, next);
        });
    }else if(obj.from == "beforeDate"){
        schedule.scheduleJob(cronDate, async () => {
            req.body.date = obj.date;
            req.body.name = obj.name;
            req.body.remind = obj.remind;
            req.body.from = "appointment_reminder_before";
            req.body.email = obj.email;
            req.body.client = obj.client;
            this.MailSend(req, res, next);
        });
    }
}

exports.MailSend = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const userId = await verifyToken(req, res, next, true);
        const { assigned, sendmail, email, name, company, phonenumber, from } = req.body;

        let subject, html;

        if (from === "lead" || from === "leadupdate") {
            const [userAssigned] = await query("SELECT * FROM users WHERE id = ?", [assigned]);
            if (!userAssigned) {
                return res.status(400).json({ success: false, message: "No assigned user found" });
            }

            const [myUser] = await query("SELECT * FROM users WHERE id = ?", [userId]);
            if (!myUser) {
                return res.status(400).json({ success: false, message: "No user found with provided ID" });
            }
            console.log("myUser", myUser);
            subject = from === "lead" ? "Lead Assignment" : "Lead Update";
            html = `
                <p>Hi ${userAssigned.full_name},</p>
                ${from === "lead" ? "<p>We are pleased to inform you that a new lead has been assigned to you. Here are the details:</p>" :
                    `<p>${company} lead updated:</p>`}
                <ul>
                    <li><strong>Lead Name:</strong> ${name}</li>
                    <li><strong>Company:</strong> ${company}</li>
                    <li><strong>Contact Information:</strong>
                        <ul>
                            <li><strong>Email:</strong> ${email}</li>
                            <li><strong>Phone:</strong> ${phonenumber}</li>
                        </ul>
                    </li>
                    <li><strong>Assigned By:</strong> ${myUser.full_name}</li>
                </ul>
                <p>Please reach out to the lead at your earliest convenience and update the CRM with your progress.</p>
                <p>Best regards,</p>
            `;

            const mailOptions = {
                from: "yashdanej2004@gmail.com",
                to: sendmail,
                subject: subject,
                html: html,
            };

            await sendEmail(mailOptions, from);
            return res.status(200).json({ success: true, message: "Mail sent successfully!" });
        } else if (from === "reminder") {
            console.log("req.body", req.body);
            subject = `Friendly Reminder: Follow-Up Needed on Lead ${req.body.lead.name}`;
            html = `
                <p>Dear ${req.body.staff.full_name},</p>
                <p>I hope this email finds you well!</p>
                <p>I wanted to remind you about the lead, ${req.body.lead.name}. As we aim to provide timely follow-ups to our potential clients, it’s important that we reach out to them promptly.</p>
                <p>Here are the key details:</p>
                <p>Lead Name: <b>${req.body.lead.name}</b></p>
                <p>Contact Information: <b>${req.body.lead.phonenumber}</b></p>
                <p>Please ensure that you contact them by today to maintain our engagement. If you need any additional information or support, feel free to reach out to me.</p>
                <p>Best regards,</p>
                <p>${req.body.creator.full_name}</p>
            `;
            console.log("req.body.staff.email", req.body.staff.email);
            const mailOptions = {
                from: "yashdanej2004@gmail.com",
                to: req.body.staff.email,
                subject: subject,
                html: html,
            };

            await sendEmail(mailOptions, from);
            await query("update tblreminders set isnotified = ? where id = ?", [true, req.body.id]);
        }else if(from === "employee"){
            console.log("req.body", req.body);
            subject = `Welcome to the Team, ${req.body.name}!`;
            html = `
                <p>Dear ${req.body.name},</p>
                <p>I hope this message finds you well. On behalf of everyone here at ${req.body.company_name}, I am delighted 
                to welcome you to our team!</p>
                <p>We are excited to have you join us as a ${req.body.designation} and look forward to the unique 
                skills and perspectives you will bring to our team. Your experience and enthusiasm will be invaluable 
                as we continue to grow and achieve great things together.</p>
                <p>Best regards,</p>
            `;
            const mailOptions = {
                from: "yashdanej2004@gmail.com",
                to: req.body.email,
                subject: subject,
                html: html,
            };

            await sendEmail(mailOptions, from);
        }else if(from === "appointment_reminder"){
            console.log("req.body", req.body);
            subject = `Friendly Reminder: Upcoming Appointment on ${req.body.date}!`;
            html = `
                <p>Dear ${req.body.name},</p>
                <p>I hope this message finds you well. This is a friendly reminder about your upcoming appointment scheduled for:</p>
                <p>Date: ${req.body.date}</p>
                <p>Client: ${req.body.client}</p>
                <p>Best regards,</p>
            `;
            const mailOptions = {
                from: "yashdanej2004@gmail.com",
                to: req.body.email,
                subject: subject,
                html: html,
            };

            await sendEmail(mailOptions, from);
            console.log("success mail sent");
        }else if(from === "appointment_reminder_before"){
            console.log("req.body", req.body);
            subject = `Friendly Reminder: Upcoming Appointment on ${req.body.remind}!`;
            html = `
                <p>Dear ${req.body.name},</p>
                <p>I hope this message finds you well. This is a friendly reminder about your upcoming appointment scheduled for:</p>
                <p>Date: ${req.body.remind}</p>
                <p>Client: ${req.body.client}</p>
                <p>Best regards,</p>
            `;
            const mailOptions = {
                from: "yashdanej2004@gmail.com",
                to: req.body.email,
                subject: subject,
                html: html,
            };

            await sendEmail(mailOptions, from);
            console.log("success mail sent");
        }
    } catch (error) {
        console.error("Error:", error);
        if(from == "reminder"){
            return;
        }
        return res.status(400).json({ success: false, message: "An error occurred", error });
    }
};

const sendEmail = async (mailOptions, from) => {
    console.log("mailOptions", mailOptions);
    const auth = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'yashdanej2004@gmail.com',
            pass: 'ybnw pzwi fcvs oriz'
        }
    });

    try {
        await auth.sendMail(mailOptions);
        console.log("Mail sent successfully!");
        if(from == "reminder" || from == "employee"){
            return;
        }
    } catch (error) {
        console.log("Failed to send email", error);
        throw error;
    }
};

exports.SendWhatsappMessage = async (req, res, next) => {
    const { full_name, name, company, email, sendphone, leadphone, source, assigned } = req.body;
    try {
        const authToken = 'U2FsdGVkX1/ug0OBB0k7o4i/C2fLQsC26whfAOfewPWDHATb0kdL+QElsbtYMiNQVH8PdYc3PpS+TG4P6S6dMACPuoX49vhOnirOfCPMtNy7//x+w9Jk8boA4nOCzTpfar6mPF/wExPqByo7EdjoF+UWqZrCB6iIYd2PRjIU1t1z3WNyUAhSk1t/zKMRvVgU';
        const sendTo = `91${sendphone}`; // Replace with the recipient's WhatsApp number
        const originWebsite = 'https://myinvented.com/';
        let templateName = 'crm';
        if(req.body.from && req.body.from == "employee"){
            templateName = "crm_employee";
        }else if(req.body.from && req.body.from == "appointment"){
            templateName = "crm_remind_appointment";
        }
        const language = 'en';
        if(req.body.from && req.body.from == "employee"){
            // Create form data
            const formData = new FormData();
            formData.append('authToken', authToken);
            formData.append('sendto', `91${req.body.phone}`);
            formData.append('originWebsite', originWebsite);
            formData.append('templateName', templateName);
            formData.append('language', language);
            formData.append('data[0]', req.body.name);
            formData.append('data[1]', req.body.company_name);
            formData.append('data[2]', req.body.designation);
            console.log("formdata", formData);
            const response = await axios.post('https://app.11za.in/apis/template/sendTemplate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('WhatsApp message sent successfully:', response.data);
            return;
        }else if(req.body.from && req.body.from == "appointment"){
            // Create form data
            const formData = new FormData();
            formData.append('authToken', authToken);
            formData.append('sendto', `91${req.body.phone}`);
            formData.append('originWebsite', originWebsite);
            formData.append('templateName', templateName);
            formData.append('language', language);
            formData.append('data[0]', req.body.name);
            formData.append('data[1]', req.body.date);
            formData.append('data[2]', req.body.client);
            console.log("formdata", formData);
            const response = await axios.post('https://app.11za.in/apis/template/sendTemplate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('WhatsApp message sent successfully:', response.data);
            return;
        }else{
            // Create form data
            const formData = new FormData();
            formData.append('authToken', authToken);
            formData.append('sendto', sendTo);
            formData.append('originWebsite', originWebsite);
            formData.append('templateName', templateName);
            formData.append('language', language);
            formData.append('data[0]', full_name);
            formData.append('data[1]', name);
            formData.append('data[2]', company?company:"No company found");
            formData.append('data[3]', email);
            formData.append('data[4]', leadphone);
            formData.append('data[5]', source);
            formData.append('data[6]', assigned);
            console.log("formdata", formData);
            const response = await axios.post('https://app.11za.in/apis/template/sendTemplate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('WhatsApp message sent successfully:', response.data);
            return res.status(200).json({success: true, message: "WhatsApp message sent successfully!"})
        }
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return res.status(400).json({success: false, message: "WhatsApp message sent failed!"})
    }
}

exports.Activity_log = async (req, res, next) => {
    try {
        let ipAddress;

        if (req.headers['x-forwarded-for']) {
            // 'x-forwarded-for' header can contain a comma-separated list of IP addresses
            ipAddress = req.headers['x-forwarded-for'].split(',').pop().trim();
        } else {
            ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
        }
        const getUser = await verifyToken(req, res, next, true);
        console.log("getUser", getUser);
        let description;
        if(req.body && req.body.description && req.body.description != ""){
            description = req.body.description
        }else{
            description = "Online"
        }
        const getMyUser = await new Promise((resolve, reject) => {
            db.query("select * from users where id = ?", [getUser], (err, result) => {
                if(err){
                    console.log("error in newActivity", err);
                    reject("error in newActivity");
                }else{
                    console.log('result', result);
                    resolve(result[0]);
                }
            });
        })
        const data = {
            userId: getMyUser.id,
            full_name: getMyUser.full_name,
            email: getMyUser.email,
            ip: ipAddress,
            description
        }
        if(req.body.leadid){
            data.leadid = req.body.leadid;
        }
        const newActivity = await new Promise((resolve, reject) => {
            db.query("insert into activity_log set ?", data, (err, result) => {
                if(err){
                    console.log("error in newActivity", err);
                    reject("error in newActivity");
                }else{
                    console.log('result', result);
                    resolve(result);
                }
            });
        });
        if(req.body && req.body.description && req.body.description != ""){
            return;
        }else{
            if(newActivity.affectedRows === 1){
                return res.status(200).json({ success: true, message: "Activity added successfully" })
            }else{
                return res.status(400).json({ success: false, message: "Error newActivity" });
            }
        }
    } catch (error) {
        return res.status(500).json({success: false, message: `Error newActivity, ${error}`});
    }
};

// getting each user activity
exports.UserActivity = async (req, res, next) => {
    try {
        const userid = req.params.userid;
        const getUser = await new Promise((resolve, reject) => {
            db.query("select * from users where id = ?", [userid], (err, result) => {
                if(err){
                    console.log("error in getUser", err);
                    reject("error in getUser");
                }else{
                    console.log('result', result);
                    resolve(result);
                }
            });
        });
        const getUserActivity = await new Promise((resolve, reject) => {
            db.query("select * from activity_log where userId = ? order by id DESC", [userid], (err, result) => {
                if(err){
                    console.log("error in getUserActivity", err);
                    reject("error in getUserActivity");
                }else{
                    console.log('result', result);
                    resolve(result);
                }
            });
        });
        console.log("getUserActivity", getUserActivity);
        const last_active = this.displayTimeOfPost(getUserActivity[0].last_active);
        console.log("");
        if(getUserActivity?.length && getUserActivity?.length>0){
            return res.status(200).json({ success: true, message: "User activity fetched successfully", user: getUser, data: getUserActivity, last_active: last_active })
        }else{
            return res.status(200).json({ success: true, message: "No user activity found", user: getUser, data: getUserActivity })
        }
    } catch (error) {
        return res.status(500).json({success: false, message: `Error getUserActivity, ${error}`});
    }
}

exports.LeadActivity = async (req, res, next) => {
    try {
        const leadid = req.params.leadid;
        const getLeadActivity = await new Promise((resolve, reject) => {
            db.query("select * from activity_log where leadid = ? order by id DESC", [leadid], (err, result) => {
                if(err){
                    console.log("error in getLeadActivity", err);
                    reject("error in getLeadActivity");
                }else{
                    console.log('result', result);
                    resolve(result);
                }
            });
        });
        if(getLeadActivity?.length && getLeadActivity?.length>0){
            return res.status(200).json({ success: true, message: "Lead activity fetched successfully", data: getLeadActivity })
        }else{
            return res.status(200).json({ success: true, message: "No lead activity found", data: getLeadActivity })
        }
    } catch (error) {
        return res.status(500).json({success: false, message: `Error getLeadActivity, ${error}`});
    }
}

exports.LastActive = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, true);
        const IsUserInIsActive =  await new Promise((resolve, reject) => {
            db.query("select * from is_active where userid = ?", [getUser], (err, result) => {
                if(err){
                    console.log("error in Last_Active", err);
                    reject("error in Last_Active");
                }else{
                    console.log('result', result);
                    resolve(result);
                }
            });
        });
        console.log("IsUserInIsActive", IsUserInIsActive);;
        if(IsUserInIsActive.length > 0){
            await new Promise((resolve, reject) => {
                db.query("update is_active set last_active = ? where userid = ?", [new Date(), getUser], (err, result) => {
                    if(err){
                        console.log("error in Last_Active", err);
                        reject("error in Last_Active");
                    }else{
                        console.log('result', result);
                        resolve(result);
                    }
                });
            });
        }else{
            const myUser = await new Promise((resolve, reject) => {
                db.query("select * from users where id = ?", [getUser], (err, result) => {
                    if(err){
                        console.log("error in Last_Active", err);
                        reject("error in Last_Active");
                    }else{
                        console.log('myUser', result);
                        resolve(result[0]);
                    }
                });
            });
            await new Promise((resolve, reject) => {
                db.query("INSERT INTO is_active SET ?", { userid: getUser, full_name: myUser.full_name, email: myUser.email, last_active: new Date() }, (err, result) => {
                    if(err){
                        console.error("Error inserting is_active:", err);
                        reject(err);
                        return res.status(400).json({ success: false, message: "Error inserting is_active", error: err });
                    }else{
                        resolve(result)
                    }
                });
            });
        }
        return res.status(200).json({ success: true, message: "Last active updated successfully" })
    } catch (error) {
        return res.status(500).json({success: false, message: `Error Last_Active, ${error}`});
    }
}

exports.GetLastActive = async (req, res, next) => {
    try {
        const userid = req.params.userid;
        const getLastActive = await new Promise((resolve, reject) => {
            db.query("select * from is_active where userid = ?", [userid], (err, result) => {
                if(err){
                    console.log("error in getLastActive", err);
                    reject("error in getLastActive");
                }else{
                    console.log('result', result);
                    resolve(result);
                }
            });
        });
        if(getLastActive?.length && getLastActive?.length>0){
            const last_Active = this.displayTimeOfPost(getLastActive[0].last_active);
            return res.status(200).json({ success: true, message: "Last active fetched successfully", data: getLastActive, last_Active: last_Active })
        }else{
            return res.status(200).json({ success: true, message: "No last activity found", data: getLastActive })
        }
    } catch (error) {
        return res.status(500).json({success: false, message: `Error getLastActive, ${error}`});
    }
}

exports.displayTimeOfPost = (ele) => {
    const createdDate = new Date(ele);
    const currentDate = new Date();
    // Calculate the time difference in milliseconds
    let timeDifference = currentDate.getTime() - createdDate.getTime();
  
    // Function to calculate the time difference in minutes, hours, days, weeks, or years
    const getTimeDifferenceString = () => {
      if (timeDifference < 60 * 1000) { // Less than 1 minute
        return "Just now";
      } else if (timeDifference < 60 * 60 * 1000) { // Less than 1 hour
        return `${Math.floor(timeDifference / (60 * 1000))} minutes ago`;
      } else if (timeDifference < 24 * 60 * 60 * 1000) { // Less than 1 day
        return `${Math.floor(timeDifference / (60 * 60 * 1000))} hours ago`;
      } else if (timeDifference < 7 * 24 * 60 * 60 * 1000) { // Less than 1 week
        const daysAgo = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
        return daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`;
      } else if (timeDifference < 365 * 24 * 60 * 60 * 1000) { // Less than 1 year
        const weeksAgo = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
        return weeksAgo === 1 ? '1 week ago' : `${weeksAgo} weeks ago`;
      } else { // More than 1 year
        const yearsAgo = Math.floor(timeDifference / (365 * 24 * 60 * 60 * 1000));
        return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
      }
    };
    return getTimeDifferenceString();
}


// Custom field start
exports.GetAllTables = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser = true);
        const getSelectedUser = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE id = ?", [getUser], (err, result) => {
                if (err) {
                    console.error("Error getSelectedUser:", err);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });

        if (getSelectedUser.role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }
        const getAllTables = await new Promise((resolve, reject) => {
            db.query("show tables", (err, result) => {
                if(err){
                    console.log("error in getAllTables", err);
                    reject("error in getAllTables");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getAllTables.length>0){
            return res.status(200).json({ success: true, message: "Tables fetched successfully", data: getAllTables })
        }else{
            return res.status(200).json({ success: true, message: "No tables found" });
        }
    } catch (error) {
        console.error("Error getAllTables:", error);
        return res.status(400).json({ success: false, message: "Error getAllTables", error: error });
    }
}

exports.CustomField = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser = true);
        const getSelectedUser = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE id = ?", [getUser], (err, result) => {
                if (err) {
                    console.error("Error getSelectedUser:", err);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });

        if (getSelectedUser.role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }
        let { fieldto, name, type, default_value, options, field_order, bs_column, disalow_client_to_edit, only_admin, required, show_on_table, show_on_client_portal } = req.body;
        if(type == "select" || type == "multi_select" || type == "checkbox"){
            if(!options || options == undefined || options == "" || options == null){
                return res.status(200).json({success: false, message: "If you select SELECT OR MULTI SELECT OR CHECKBOX then you must have to add options"});
            }
        }else{
            options = null;
        }
        if(!default_value){
            default_value = null;
        }
        if(!field_order){
            field_order = 0
        }
        if(required == null){
            required = 0
        }
        if(only_admin == null){
            only_admin = 0
        }
        if(show_on_table == null){
            show_on_table = 0
        }
        if(show_on_client_portal == null){
            show_on_client_portal = 0
        }
        if(disalow_client_to_edit == null){
            disalow_client_to_edit = 0
        }
        field_order = parseInt(field_order);
        bs_column = parseInt(bs_column);
        await new Promise((resolve, reject) => {
            db.query(`insert into tblcustomfields set ?`, {
                fieldto,
                name,
                slug: `${fieldto}_${name}`,
                required,
                type,
                options,
                field_order,
                only_admin,
                show_on_table,
                show_on_client_portal,
                disalow_client_to_edit,
                bs_column,
                default_value,
                addfrom: getUser,
                company_id: getSelectedUser.company_id
            }, (err, result) => {
                if(err) return reject(err);
                resolve(result);
            })
        });
        // adding activity log
        req.body.description = `Custom field added in table [${fieldto}], name is [${name}], type is [${type}]`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: 'Column added successfully' });

    } catch (error) {
        console.error(`Error in CustomField: ${error}`);
        return res.status(500).json({ success: false, message: `Error CustomField, ${error}` });
    }
};

exports.CustomFieldValue = async (req, res, next, refid, fieldid, fieldto, column_value, fromAction, name) => {
    try {
        if (fromAction === "update") {
            console.log("this is from update------------");
            const result = await new Promise((resolve, reject) => {
                db.query("update tblcustomfieldsvalues set column_value = ? where refid = ? and fieldid = ?", [column_value, refid, fieldid], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

            if (result.affectedRows === 0) {
                await new Promise((resolve, reject) => {
                    db.query("insert into tblcustomfieldsvalues set ?", {
                        refid,
                        fieldid,
                        fieldto,
                        column_value
                    }, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            }
        } else {
            await new Promise((resolve, reject) => {
                db.query("insert into tblcustomfieldsvalues set ?", {
                    refid,
                    fieldid,
                    fieldto,
                    column_value
                }, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }

        req.body.description = `${fromAction === "update" ? "Updated" : "Inserted"} value in tblcustomfieldsvalues: table is [${fieldto}], name is [${name}], value is [${column_value}]`;
        await this.Activity_log(req, res, next);
        console.log("added");
    } catch (error) {
        console.error(`Error in CustomField: ${error}`);
    }
};

exports.getColumn = async (req, res, next, table_name) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser = true);
        const getSelectedUser = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE id = ?", [getUser], (err, result) => {
                if (err) {
                    console.error("Error getSelectedUser:", err);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
        const columnExistOrNot = await new Promise((resolve, reject) => {
            db.query("select * from tblcustomfields where fieldto = ? and company_id = ?", [table_name, getSelectedUser.company_id], (err, result) => {
                if(err) return reject(err);
                resolve(result);
            });
        });
        return columnExistOrNot;
    } catch (error) {
        console.error(`Error in getColumn: ${error}`);
    }
}

exports.GetCustomFields = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, { verifyUser: true });
        const getSelectedUser = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE id = ?", [getUser], (err, result) => {
                if (err) {
                    console.error("Error getSelectedUser:", err);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });

        if (getSelectedUser.role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }

        let table = req.params.table || "";
        let active = req.params.active ? true : null;

        let query = "SELECT * FROM tblcustomfields WHERE 1=1";
        let params = [];

        if (table) {
            query += " AND fieldto = ?";
            params.push(table);
        }
        if (active !== null) {
            query += " AND active = ?";
            params.push(active);
        }
        query += " AND company_id = ? ";
        params.push(getSelectedUser.company_id);
        query += "ORDER BY field_order";

        console.log("query", query, "params", params);

        const getCustomFields = await new Promise((resolve, reject) => {
            db.query(query, params, (err, result) => {
                if (err) {
                    console.log("error in getCustomFields", err);
                    reject("error in getCustomFields");
                } else {
                    resolve(result);
                }
            });
        });

        if (getCustomFields.length > 0) {
            return res.status(200).json({ success: true, message: "Custom fields fetched successfully", data: getCustomFields });
        } else {
            return res.status(200).json({ success: true, message: "No custom fields found" });
        }
    } catch (error) {
        console.error("Error getCustomFields:", error);
        return res.status(400).json({ success: false, message: "Error getCustomFields", error: error });
    }
}

exports.ChangeCustomFieldActive = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const getUser = await verifyToken(req, res, next, { verifyUser: true });

        const getSelectedUser = await query("SELECT * FROM users WHERE id = ?", [getUser]);
        if (!getSelectedUser.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (getSelectedUser[0].role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }

        const fieldid = req.params.fieldid;
        const getField = await query("SELECT * FROM tblcustomfields WHERE id = ?", [fieldid]);
        if (!getField.length) {
            return res.status(404).json({ success: false, message: "Field not found" });
        }

        console.log("getField", getField[0]);

        await query("UPDATE tblcustomfields SET active = ? WHERE id = ?", [!getField[0].active, fieldid]);
        req.body.description = `Updated active for id [${getField[0].id}] table [${getField[0].fieldto}], name is [${getField[0].name}], type is [${getField[0].active}]`;
        await this.Activity_log(req, res, next);

        return res.status(200).json({ success: true, message: "Active changed successfully", active: !getField[0].active});
    } catch (error) {
        console.error("Error in ChangeCustomFieldActive:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

exports.DeleteCustomField = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const getUser = await verifyToken(req, res, next, { verifyUser: true });

        const getSelectedUser = await query("SELECT * FROM users WHERE id = ?", [getUser]);
        if (!getSelectedUser.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (getSelectedUser[0].role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }

        const fieldid = req.params.fieldid;
        const getField = await query("delete from tblcustomfields WHERE id = ?", [fieldid]);
        console.log("getField", getField);
        if (!getField.affectedRows) {
            return res.status(404).json({ success: false, message: "Field not found" });
        }

        await query("delete from tblcustomfieldsvalues where fieldid = ?", [fieldid]);
        req.body.description = `Deleted custom field id: [${fieldid}]`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Field deleted successfully" });
    } catch (error) {
        console.error("Error in ChangeCustomFieldActive:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

exports.EditCustomField = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const getUser = await verifyToken(req, res, next, { verifyUser: true });

        const getSelectedUser = await query("SELECT * FROM users WHERE id = ?", [getUser]);
        if (!getSelectedUser.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (getSelectedUser[0].role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }

        const fieldid = req.params.fieldid;
        const getField = await query("select * from tblcustomfields WHERE id = ?", [fieldid]);
        console.log("getField", getField[0]);
        if (!getField.length) {
            return res.status(404).json({ success: false, message: "Custom field not found" });
        }
        return res.status(200).json({ success: true, message: "Custom field fetched successfully", data: getField[0] });
    } catch (error) {
        console.error("Error in ChangeCustomFieldActive:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

exports.UpdateCustomField = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const getUser = await verifyToken(req, res, next, { verifyUser: true });

        const getSelectedUser = await query("SELECT * FROM users WHERE id = ?", [getUser]);
        if (!getSelectedUser.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (getSelectedUser[0].role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }

        const { fieldto, name, default_value, field_order, bs_column, disalow_client_to_edit, only_admin, required, show_on_table, show_on_client_portal } = req.body;
        const fieldid = req.params.fieldid;
        const makeSlug = `${fieldto}_${name}`;
        const getField = await query("update tblcustomfields set name = ?, slug = ?, default_value =  ?, field_order= ?, bs_column = ?, disalow_client_to_edit = ?, only_admin = ?, required = ?, show_on_table = ?, show_on_client_portal = ? WHERE id = ?", [
            name, makeSlug, default_value, field_order, bs_column, disalow_client_to_edit, only_admin, required, show_on_table, show_on_client_portal,
            fieldid
        ]);
        console.log("getField", getField);
        req.body.description = `Updated tblcustomfields for id [${fieldid}] table [${fieldto}], name is [${name}]`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Custom field updated successfully" });
    } catch (error) {
        console.error("Error in UpdateCustomField:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

// grp
exports.createGrpName = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        const sql = "INSERT INTO crmdb.grp_name (name) VALUES (?);";
        await query(sql, [name]);
        req.body.description = `Group added. group name is [${name}]`;
        await this.Activity_log(req, res, next);
        return res.status(201).json({ success: true, message: "Group name created successfully" });
    } catch (error) {
        console.log("Error in createGrpName", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAllGrpNames = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const sql = "SELECT * FROM crmdb.grp_name;";
        const grpNames = await query(sql);
        return res.status(200).json({ success: true, data: grpNames });
    } catch (error) {
        console.log("Error in getAllGrpNames", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getGrpNameById = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "SELECT * FROM crmdb.grp_name WHERE id = ?;";
        const grpName = await query(sql, [id]);
        if (grpName.length === 0) {
            return res.status(404).json({ success: false, message: "Group name not found" });
        }
        return res.status(200).json({ success: true, data: grpName });
    } catch (error) {
        console.log("Error in getGrpNameById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateGrpName = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const get = await query("select * from grp_name where id = ?", [id]);
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        const sql = "UPDATE crmdb.grp_name SET name = ? WHERE id = ?;";
        const result = await query(sql, [name, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Group name not found" });
        }
        req.body.description = `Group id: [${id}] updated. from group name [${get[0].name}] to [${name}]`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Group name updated successfully" });
    } catch (error) {
        console.log("Error in updateGrpName", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.deleteGrpName = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const get = await query("select * from grp_name where id = ?", [id]);
        const sql = "DELETE FROM crmdb.grp_name WHERE id = ?;";
        const result = await query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Group name not found" });
        }
        req.body.description = `Group id: [${id}], name [${get[0].name}] deleted`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Group name deleted successfully" });
    } catch (error) {
        console.log("Error in deleteGrpName", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// it status
exports.createItStatus = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        const sql = "INSERT INTO crmdb.it_status (name) VALUES (?);";
        await query(sql, [name]);
        req.body.description = `ItStatus name: [${name}] added`;
        await this.Activity_log(req, res, next);
        return res.status(201).json({ success: true, message: "IT status created successfully" });
    } catch (error) {
        console.log("Error in createItStatus", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAllItStatus = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const sql = "SELECT * FROM crmdb.it_status;";
        const itStatus = await query(sql);
        return res.status(200).json({ success: true, data: itStatus });
    } catch (error) {
        console.log("Error in getAllItStatus", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getItStatusById = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "SELECT * FROM crmdb.it_status WHERE id = ?;";
        const itStatus = await query(sql, [id]);
        if (itStatus.length === 0) {
            return res.status(404).json({ success: false, message: "IT status not found" });
        }
        return res.status(200).json({ success: true, data: itStatus });
    } catch (error) {
        console.log("Error in getItStatusById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateItStatus = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const get = await query("select * from it_status where id = ?", [id]);
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        const sql = "UPDATE crmdb.it_status SET name = ? WHERE id = ?;";
        const result = await query(sql, [name, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "IT status not found" });
        }
        req.body.description = `ItStatus id: [${id}] updated. from ItStatus name [${get[0].name}] to [${name}]`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "IT status updated successfully" });
    } catch (error) {
        console.log("Error in updateItStatus", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteItStatus = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "DELETE FROM crmdb.it_status WHERE id = ?;";
        const result = await query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "IT status not found" });
        }
        req.body.description = `ItStatus id: [${id}], name [${get[0].name}] deleted`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "IT status deleted successfully" });
    } catch (error) {
        console.log("Error in deleteItStatus", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// master type
exports.createMasterType = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        const sql = "INSERT INTO crmdb.master_type (name) VALUES (?);";
        await query(sql, [name]);
        req.body.description = `MasterType name: [${name}] added`;
        await this.Activity_log(req, res, next);
        return res.status(201).json({ success: true, message: "Master type created successfully" });
    } catch (error) {
        console.log("Error in createMasterType", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAllMasterTypes = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const sql = "SELECT * FROM crmdb.master_type;";
        const masterTypes = await query(sql);
        return res.status(200).json({ success: true, data: masterTypes });
    } catch (error) {
        console.log("Error in getAllMasterTypes", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getMasterTypeById = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "SELECT * FROM crmdb.master_type WHERE id = ?;";
        const masterType = await query(sql, [id]);
        if (masterType.length === 0) {
            return res.status(404).json({ success: false, message: "Master type not found" });
        }
        return res.status(200).json({ success: true, data: masterType });
    } catch (error) {
        console.log("Error in getMasterTypeById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateMasterType = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        const sql = "UPDATE crmdb.master_type SET name = ? WHERE id = ?;";
        const result = await query(sql, [name, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Master type not found" });
        }
        const get = await query("select * from master_type where id = ?", [id]);
        req.body.description = `MasterType id: [${id}] updated. from MasterType name [${get[0].name}] to [${name}]`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Master type updated successfully" });
    } catch (error) {
        console.log("Error in updateMasterType", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteMasterType = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "DELETE FROM crmdb.master_type WHERE id = ?;";
        const result = await query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Master type not found" });
        }
        const get = await query("select * from master_type where id = ?", [id]);
        req.body.description = `MasterType id: [${id}], name [${get[0].name}] deleted`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Master type deleted successfully" });
    } catch (error) {
        console.log("Error in deleteMasterType", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// currency
exports.createCurrency = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { name } = req.body;
        const sql = "INSERT INTO currency_master (name) VALUES (?);";
        await query(sql, [name]);
        req.body.description = `Currency name: [${name}] added`;
        await this.Activity_log(req, res, next);
        return res.status(201).json({ success: true, message: "Currency created successfully" });
    } catch (error) {
        console.log("Error in createCurrency", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getCurrency = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const sql = "SELECT * FROM currency_master;";
        const currency = await query(sql);
        if (currency.length === 0) {
            return res.status(404).json({ success: false, message: "Currency not found" });
        }
        return res.status(200).json({ success: true, data: currency });
    } catch (error) {
        console.log("Error in getCurrencyById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getCurrencyById = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "SELECT * FROM currency_master WHERE id = ?;";
        const currency = await query(sql, [id]);
        if (currency.length === 0) {
            return res.status(404).json({ success: false, message: "Currency not found" });
        }
        return res.status(200).json({ success: true, data: currency });
    } catch (error) {
        console.log("Error in getCurrencyById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateCurrency = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const { name } = req.body;
        const sql = "UPDATE currency_master SET name = ? WHERE id = ?;";
        await query(sql, [name, id]);
        const get = await query("select * from currency_master where id = ?", [id]);
        req.body.description = `Currency id: [${id}] updated. from Currency name [${get[0].name}] to [${name}]`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Currency updated successfully" });
    } catch (error) {
        console.log("Error in updateCurrency", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.deleteCurrency = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "DELETE FROM currency_master WHERE id = ?;";
        await query(sql, [id]);
        const get = await query("select * from currency_master where id = ?", [id]);
        req.body.description = `Currency id: [${id}], name [${get[0].name}] deleted`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Currency deleted successfully" });
    } catch (error) {
        console.log("Error in deleteCurrency", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// sub_master
exports.createSubMaster = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { name } = req.body;
        const sql = "INSERT INTO sub_master (name) VALUES (?);";
        await query(sql, [name]);
        req.body.description = `SubMaster name: [${name}] added`;
        await this.Activity_log(req, res, next);
        return res.status(201).json({ success: true, message: "Sub master created successfully" });
    } catch (error) {
        console.log("Error in createsub_master", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getSubMaster = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const sql = "SELECT * FROM sub_master;";
        const sub_master = await query(sql);
        if (sub_master.length === 0) {
            return res.status(404).json({ success: false, message: "sub_master not found" });
        }
        return res.status(200).json({ success: true, data: sub_master });
    } catch (error) {
        console.log("Error in getsub_masterById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getSubMasterById = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "SELECT * FROM sub_master WHERE id = ?;";
        const sub_master = await query(sql, [id]);
        if (sub_master.length === 0) {
            return res.status(404).json({ success: false, message: "sub_master not found" });
        }
        return res.status(200).json({ success: true, data: sub_master });
    } catch (error) {
        console.log("Error in getsub_masterById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateSubMaster = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const { name } = req.body;
        const sql = "UPDATE sub_master SET name = ? WHERE id = ?;";
        await query(sql, [name, id]);
        const get = await query("select * from sub_master where id = ?", [id]);
        req.body.description = `SubMaster id: [${id}] updated. from SubMaster name [${get[0].name}] to [${name}]`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "sub_master updated successfully" });
    } catch (error) {
        console.log("Error in updatesub_master", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.deleteSubMaster = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "DELETE FROM sub_master WHERE id = ?;";
        await query(sql, [id]);
        const get = await query("select * from sub_master where id = ?", [id]);
        req.body.description = `SubMaster id: [${id}], name [${get[0].name}] deleted`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Currency deleted successfully" });
    } catch (error) {
        console.log("Error in deleteCurrency", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// designation
exports.createDesignation = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { name } = req.body;
        const sql = "INSERT INTO designation (name) VALUES (?);";
        await query(sql, [name]);
        req.body.description = `Designation name: [${name}] added`;
        await this.Activity_log(req, res, next);
        return res.status(201).json({ success: true, message: "Designation created successfully" });
    } catch (error) {
        console.log("Error in designation", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getDesignation = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const sql = "SELECT * FROM designation;";
        const designation = await query(sql);
        if (designation.length === 0) {
            return res.status(404).json({ success: false, message: "Designation not found" });
        }
        return res.status(200).json({ success: true, data: designation });
    } catch (error) {
        console.log("Error in designation", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getDesignationById = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "SELECT * FROM designation WHERE id = ?;";
        const designation = await query(sql, [id]);
        if (designation.length === 0) {
            return res.status(404).json({ success: false, message: "Designation not found" });
        }
        return res.status(200).json({ success: true, data: designation });
    } catch (error) {
        console.log("Error in designation", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateDesignation = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const { name } = req.body;
        const sql = "UPDATE designation SET name = ? WHERE id = ?;";
        await query(sql, [name, id]);
        const get = await query("select * from designation where id = ?", [id]);
        req.body.description = `Designation id: [${id}] updated. from Designation name [${get[0].name}] to [${name}]`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Designation updated successfully" });
    } catch (error) {
        console.log("Error in designation", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.deleteDesignation = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const sql = "DELETE FROM designation WHERE id = ?;";
        await query(sql, [id]);
        const get = await query("select * from designation where id = ?", [id]);
        req.body.description = `Designation id: [${id}], name [${get[0].name}] deleted`;
        await this.Activity_log(req, res, next);
        return res.status(200).json({ success: true, message: "Designation deleted successfully" });
    } catch (error) {
        console.log("Error in designation", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Status
exports.createStatus = async (req, res, next) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { name } = req.body;
        const getUser = await verifyToken(req, res, next, { verifyUser: true });
        
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        const sql = `INSERT INTO crmdb.tblstatus (name, addedfrom) VALUES (?, ?)`;
        const result = await query(sql, [name, getUser]);

        const newStatus = await query("SELECT * FROM crmdb.tblstatus WHERE id = ?", [result.insertId]);
        return res.status(201).json({ success: true, message: "Status created successfully", data: newStatus });
    } catch (error) {
        console.log("Error in createStatus", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAllStatuses = async (req, res) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const statuses = await query("SELECT * FROM crmdb.tblstatus");
        return res.status(200).json({ success: true, data: statuses });
    } catch (error) {
        console.log("Error in getAllStatuses", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getStatusById = async (req, res) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const status = await query("SELECT * FROM crmdb.tblstatus WHERE id = ?", [id]);

        if (status.length === 0) {
            return res.status(404).json({ success: false, message: "Status not found" });
        }

        return res.status(200).json({ success: true, data: status });
    } catch (error) {
        console.log("Error in getStatusById", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        const sql = `UPDATE crmdb.tblstatus SET name = ? WHERE id = ?`;
        await query(sql, [name, id]);

        const updatedStatus = await query("SELECT * FROM crmdb.tblstatus WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Status updated successfully", data: updatedStatus });
    } catch (error) {
        console.log("Error in updateStatus", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteStatus = async (req, res) => {
    try {
        const query = util.promisify(db.query).bind(db);
        const { id } = req.params;
        const status = await query("SELECT * FROM crmdb.tblstatus WHERE id = ?", [id]);

        if (status.length === 0) {
            return res.status(404).json({ success: false, message: "Status not found" });
        }

        await query("DELETE FROM crmdb.tblstatus WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Status deleted successfully" });
    } catch (error) {
        console.log("Error in deleteStatus", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
