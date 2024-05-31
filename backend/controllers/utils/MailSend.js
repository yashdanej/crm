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
    const { full_name, name, company, email, phone, source, assigned } = req.body;
    try {
        const authToken = 'U2FsdGVkX1/ug0OBB0k7o4i/C2fLQsC26whfAOfewPWDHATb0kdL+QElsbtYMiNQVH8PdYc3PpS+TG4P6S6dMACPuoX49vhOnirOfCPMtNy7//x+w9Jk8boA4nOCzTpfar6mPF/wExPqByo7EdjoF+UWqZrCB6iIYd2PRjIU1t1z3WNyUAhSk1t/zKMRvVgU';
        const sendTo = `91${phone}`; // Replace with the recipient's WhatsApp number
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
        formData.append('data[4]', phone);
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