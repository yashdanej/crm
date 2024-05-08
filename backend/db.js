const mysql = require("mysql");

const db = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "Yash@05062004",
    database: "crm"
});
module.exports = db;
