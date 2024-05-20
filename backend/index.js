const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const PORT = 8000;

const app = express();
app.use(cors({
    origin: 'http://65.0.30.99',  // i am doing this because of cookie request
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth/authRouter");
const leadRouter = require("./routes/lead/leadRouter");

app.use('/api/v1', authRouter);
app.use('/api/v1/lead', leadRouter);

app.listen(PORT, () => {
    console.log("Server started");
});