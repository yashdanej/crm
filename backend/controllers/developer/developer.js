const util = require('util');
const db = require('../../db');
const { verifyToken } = require('../../middleware/verifyToken');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const query = util.promisify(db.query).bind(db);

exports.addCompany = async (req, res, next) => {
 try {
    const getUser = await verifyToken(req, res, next, verifyUser=true);
    const selectedUser = await query("select * from users where id = ?", [getUser]);
    if(selectedUser[0].role != 4){
        return res.status(200).json({success: false, message: "Permission denied"});
    }
    const { name } = req.body;
    const addingCompany = await query("insert into company set ?", {
        name
    });
    console.log("addingCompany", addingCompany);
    if(addingCompany.affectedRows === 1){
        const companyData = await query("select * from company where id = ?", [addingCompany.insertId]);
        return res.status(200).json({success: true, message: "Company added successfully", data: companyData});
    }else{
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
 } catch (error) {
    console.log("error in addNote", error);
 }
}

exports.getCompany = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const selectedUser = await query("select * from users where id = ?", [getUser]);
        if(selectedUser[0].role != 4){
            return res.status(200).json({success: false, message: "Permission denied"});
        }
        const getCompany = await query("select * from company");
        if(getCompany.length > 0){
            return res.status(200).json({success: true, message: "Company fetched successfully!", data: getCompany});
        }else{
            return res.status(200).json({success: true, message: "No company found!", data: []});
        }
     } catch (error) {
        console.log("error in getCompany", error);
     }
}

exports.SuperAdmin = async (req, res) => {
    const getUser = await verifyToken(req, res, next, verifyUser=true);
    const { email, user_password, full_name, phonenumber, company_id } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash_password = bcrypt.hashSync(user_password, salt);
    try {
        // Check if email already exists
        console.log(email);
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, existingEmail) => {
            if(err){
                console.log("error in select email", err);
                return res.status(200).json({ success: false, message: "Error selecting email", error: err });
            }
            console.log('existingEmail', existingEmail);
            if (existingEmail.length > 0) {
                return res.status(200).json({ success: false, message: "Email already exists" });
            }

            // If email doesn't exist, insert new user
            db.query("INSERT INTO users SET ?", { email, full_name, user_password: hash_password, phone: phonenumber, company_id, role: 3, addedfrom: getUser }, (err, result) => {
                if(err){
                    console.error("Error inserting user:", err);
                    return res.status(400).json({ success: false, message: "Error inserting user", error: err });
                }
                db.query("INSERT INTO is_active SET ?", { userid: result.insertId, full_name: full_name, email: email, last_active: new Date() }, (err, result) => {
                    if(err){
                        console.error("Error inserting is_active:", err);
                        return res.status(400).json({ success: false, message: "Error inserting user", error: err });
                    }
                });
                console.log("User inserted:", result);
                return res.status(200).json({ success: true, message: "User signed up successfully" });
            });
        });
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(400).json({ success: false, message: "Error signing up", error: error });
    }
};

exports.getSuperAdmins = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const selectedUser = await query("select * from users where id = ?", [getUser]);
        if(selectedUser[0].role != 4){
            return res.status(200).json({success: false, message: "Permission denied"});
        }
        const getSupAdmins = await query("select * from users where role = ?", [3]);
        if(getSupAdmins.length > 0){
            return res.status(200).json({success: true, message: "Super admins fetched successfully!", data: getSupAdmins});
        }else{
            return res.status(200).json({success: true, message: "No super admins found!", data: []});
        }
     } catch (error) {
        console.log("error in getSuperAdmins", error);
     }
}