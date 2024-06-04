const nodemailer = require("nodemailer");
const { verifyToken } = require("../../middleware/verifyToken");
const axios = require("axios");
const db = require("../../db");

exports.MailSend = (req, res, next) => {
    const { assigned, email, name, company, phonenumber, from } = req.body;

    try {
        // Verify the token and get the user details
        verifyToken(req, res, next, true)
            .then(userId => {
                // Query the database for the assigned user
                db.query("SELECT * FROM users WHERE id = ?", [assigned], (err, result) => {
                    if (err) {
                        console.log("error in userAssigned", err);
                        return res.status(500).json({ success: false, message: "Database query error" });
                    }

                    if (result === undefined || result.length === 0) {
                        return res.status(400).json({ success: false, message: "No assigned user found" });
                    }

                    const userAssigned = result[0];
                    
                    // Now that you have the userId, execute the second database query
                    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, myUserResult) => {
                        if (err) {
                            console.log("error in myUser", err);
                            return res.status(500).json({ success: false, message: "Database query error" });
                        }
        
                        if (myUserResult === undefined || myUserResult.length === 0) {
                            console.log("No user found with ID", userId);
                            return res.status(400).json({ success: false, message: "No user found with provided ID" });
                        }
        
                        const myUser = myUserResult[0].full_name;
                        console.log("myUser", myUser.full_name);
                        
                        // Create the transporter object for nodemailer
                        const auth = nodemailer.createTransport({
                            service: 'gmail',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'yashdanej2004@gmail.com',
                                pass: 'vkce zpez qhkk chkh'
                            }
                        });

                        let subject;
                        let html;
                        if (from == "lead" || from == "leadupdate") {
                            subject = from=="lead"?"Lead Assignment":"Lead Update";
                            html = `
                                <p>Hi ${userAssigned.full_name},</p>
                                ${from == "lead"?"<p>We are pleased to inform you that a new lead has been assigned to you. Here are the details:</p>":
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
                                    <li><strong>Assigned By:</strong> ${myUser}</li>
                                </ul>
                                <p>Please reach out to the lead at your earliest convenience and update the CRM with your progress.</p>
                                <p>Best regards,</p>
                            `;
                        }

                        const mailOptions = {
                            from: "yashdanej2004@gmail.com",
                            to: email,
                            subject: subject,
                            html: html,
                        };

                        // Send the email using nodemailer
                        auth.sendMail(mailOptions, (error, response) => {
                            if (error) {
                                console.log("error", error);
                                return res.status(500).json({ success: false, message: "Failed to send email", error });
                            } else {
                                const leadDetails = {
                                    name: 'John Doe',
                                    company: 'ABC Company',
                                    email: 'yashdanej2004@gmail.com',
                                    phone: '9106253017',
                                    leadSource: 'Website',
                                    assignedBy: 'Jane Smith'
                                };
                                return res.status(200).json({ success: true, message: "Mail sent successfully!" });
                            }
                        });
                    });
                });
            })
            .catch(error => {
                console.error("Error:", error);
                return res.status(401).json({ success: false, message: "You are not authenticated", error });
            });
    } catch (error) {
        console.error("Error:", error);
        return res.status(400).json({ success: false, message: "An error occurred", error });
    }
};

exports.SendWhatsappMessage = async (req, res, next) => {
    const { full_name, name, company, email, sendphone, leadphone, source, assigned } = req.body;
    try {
        const authToken = 'U2FsdGVkX1/ug0OBB0k7o4i/C2fLQsC26whfAOfewPWDHATb0kdL+QElsbtYMiNQVH8PdYc3PpS+TG4P6S6dMACPuoX49vhOnirOfCPMtNy7//x+w9Jk8boA4nOCzTpfar6mPF/wExPqByo7EdjoF+UWqZrCB6iIYd2PRjIU1t1z3WNyUAhSk1t/zKMRvVgU';
        const sendTo = `91${sendphone}`; // Replace with the recipient's WhatsApp number
        const originWebsite = 'https://myinvented.com/';
        const templateName = 'crm';
        const language = 'en';

        // Create form data
        const formData = new FormData();
        formData.append('authToken', authToken);
        formData.append('sendto', sendTo);
        formData.append('originWebsite', originWebsite);
        formData.append('templateName', templateName);
        formData.append('language', language);
        formData.append('data[0]', full_name);
        formData.append('data[1]', name);
        formData.append('data[2]', company);
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
            db.query("select * from activity_log where leadid = ?", [leadid], (err, result) => {
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