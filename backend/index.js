const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = 8000;
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',  // i am doing this because of cookie request
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth/authRouter");
const leadRouter = require("./routes/lead/leadRouter");
const agentRouter = require("./routes/agents/agentRouter");
const notificationRouter = require("./routes/notification/notificationRoute");

app.use('/api/v1', authRouter);
app.use('/api/v1/lead', leadRouter);
app.use('/api/v1/agents', agentRouter);
app.use('/api/v1/notification', notificationRouter);

app.use('/api/v1/zipcode', createProxyMiddleware({
    target: 'http://www.postalpincode.in',
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/zipcode': '/api/pincode', // correctly rewrite the path
    },
}));

const server =  app.listen(PORT, () => {
    console.log("Server started");
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
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