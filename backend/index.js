const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth/authRouter");
const leadRouter = require("./routes/lead/leadRouter");

app.use('/api/v1', authRouter);
app.use('/api/v1/lead', leadRouter);

app.listen(3000, () => {
    console.log("Server started");
});