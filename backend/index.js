const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const schedule = require('node-schedule');
const nodemailer = require("nodemailer");
const axios = require("axios");
const PORT = 3001;
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',  // i am doing this because of cookie request
    // origin: 'http://65.0.30.99',  // i am doing this because of cookie request
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth/authRouter");
const leadRouter = require("./routes/lead/leadRouter");
const agentRouter = require("./routes/agents/agentRouter");
const notificationRouter = require("./routes/notification/notificationRoute");
const notesRouter = require("./routes/notes/notesRouter");
const reminderRouter = require("./routes/reminder/reminderRoutes");
const attachmentRouter = require("./routes/attachment/attachmentRouter");
const utilRouter = require("./routes/utils/router");
const db = require("./db");
const { MailSend, SendWhatsappMessage } = require("./controllers/utils/util");

app.set('trust proxy', true); // for getting ip address even if proxy
app.use('/api/v1', authRouter);
app.use('/api/v1/lead', leadRouter);
app.use('/api/v1/agents', agentRouter);
app.use('/api/v1/notification', notificationRouter);
app.use('/api/v1/notes', notesRouter);
app.use('/api/v1/reminder', reminderRouter);
app.use('/api/v1/attachment', attachmentRouter);
app.use('/api/v1/util', utilRouter);

app.use('/api/v1/zipcode', createProxyMiddleware({
    target: 'http://www.postalpincode.in',
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/zipcode': '/api/pincode', // correctly rewrite the path
    },
}));

const MailSending = (user) => {
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
    subject = "Not updated lead in past 2 days";
    html = `
        <p>Hi ${user.full_name},</p>
        <p>You have not updated your lead in the past 2 days. Please update the lead information as soon as possible.</p>
        <p>Best regards,</p>
    `;

    const mailOptions = {
        from: "yashdanej2004@gmail.com",
        to: user.email,
        subject: subject,
        html: html,
    };

    auth.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Email sent successfully to:", user.email);
        }
    });
}

const WhatsappMessage = async (user) => {
    try {
        const authToken = 'U2FsdGVkX1/ug0OBB0k7o4i/C2fLQsC26whfAOfewPWDHATb0kdL+QElsbtYMiNQVH8PdYc3PpS+TG4P6S6dMACPuoX49vhOnirOfCPMtNy7//x+w9Jk8boA4nOCzTpfar6mPF/wExPqByo7EdjoF+UWqZrCB6iIYd2PRjIU1t1z3WNyUAhSk1t/zKMRvVgU';
        const sendTo = `91${user.phone}`; // Replace with the recipient's WhatsApp number
        const originWebsite = 'https://myinvented.com/';
        const templateName = 'leadreminder';
        const language = 'en';

        // Create form data
        const formData = new FormData();
        formData.append('authToken', authToken);
        formData.append('sendto', sendTo);
        formData.append('originWebsite', originWebsite);
        formData.append('templateName', templateName);
        formData.append('language', language);
        formData.append('data[0]', user.full_name);
        console.log("formdata", formData);
        const response = await axios.post('https://app.11za.in/apis/template/sendTemplate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('WhatsApp message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}
// * * * * * --> every minute
// 0 0 * * * --> everyday 12 AM
// */10 * * * * * --> every 10 second
schedule.scheduleJob('0 0 * * *', async (req, res, next) => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const getLeads = await new Promise((resolve, reject) => {
            db.query("select * from tblleads where lastcontact < ?", [twoDaysAgo], (err, result) => {
                if(err) return reject(err);
                resolve(result);
            });
        });
        if(getLeads.length > 0){
            getLeads.forEach(async element => {
                const assignedUserId = element.assigned;
                const getAssignedUser = await new Promise((resolve, reject) => {
                    db.query("select * from users where id = ?", [assignedUserId], (err, result) => {
                        if(err) return reject(err);
                        resolve(result[0]);
                    });
                });
                console.log("getAssignedUser", getAssignedUser);
                MailSending(getAssignedUser);
                if(getAssignedUser.phone != null){
                    await WhatsappMessage(getAssignedUser)
                }
            });
        }
        // console.log("Leads with no contact in the past 2 days:", getLeads);
    } catch (error) {
        console.error('Error processing birthdays:', error);
    }
});

const server =  app.listen(PORT, () => {
    console.log("Server started");
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // origin: "http://65.0.30.99",
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    // connecting to socket server
    socket.on("setup", (userData) => {
        console.log("userData", userData);
        socket.join(userData?.id);
        socket.emit("connected");
    });

    socket.on("newnotification", (newNotificationReceived) => {
        console.log("newNotificationReceived", newNotificationReceived);
        socket.in(newNotificationReceived?.receiveuser_id).emit("notification received", newNotificationReceived);
    })
});