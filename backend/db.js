const mysql = require("mysql");

const db = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "Yash@1212888",
    database: "crmdb"
});
module.exports = db;
