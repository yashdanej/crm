const nodemailer = require("nodemailer");

exports.SendMail = async (data, to, from) => {
    // Connect with SMTP
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

    if (from === "lead") {
        subject = "Lead Assignment";
        html = `
            <p>Hi ${data.full_name},</p>
            <p>We are pleased to inform you that a new lead has been assigned to you. Here are the details:</p>
            <ul>
                <li><strong>Lead Name:</strong> ${data.name}</li>
                <li><strong>Company:</strong> ${data.company}</li>
                <li><strong>Contact Information:</strong>
                    <ul>
                        <li><strong>Email:</strong> ${to}</li>
                        <li><strong>Phone:</strong> ${data.phonenumber}</li>
                    </ul>
                </li>
                <li><strong>Assigned By:</strong> ${data.assigned_by}</li>
            </ul>
            <p>Please reach out to the lead at your earliest convenience and update the CRM with your progress.</p>
            <p>Best regards,</p>
        `;
    }

    const mailOptions = {
        from: "yashdanej2004@gmail.com", // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
    };

    try {
        await auth.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}