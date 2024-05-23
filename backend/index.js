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

app.use('/api/v1', authRouter);
app.use('/api/v1/lead', leadRouter);
app.use('/api/v1/agents', agentRouter);
app.use('/api/v1/zipcode', createProxyMiddleware({
    target: 'http://www.postalpincode.in',
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/zipcode': '/api/pincode', // correctly rewrite the path
    },
}));

app.listen(PORT, () => {
    console.log("Server started");
});