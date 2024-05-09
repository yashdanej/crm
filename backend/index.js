const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

const authRouter = require("./routes/auth/authRouter");

app.use('/api/v1', authRouter);

app.listen(3000, () => {
    console.log("Server started");
});