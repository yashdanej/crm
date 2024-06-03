const bcrypt = require("bcrypt");
const db = require("../../db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../../middleware/verifyToken");
const { Activity_log } = require("../utils/util");

exports.Signup = async (req, res) => {
    const { email, user_password, full_name } = req.body;
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
            db.query("INSERT INTO users SET ?", { email, full_name, user_password: hash_password }, (err, result) => {
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

exports.Login = async (req, res, next) => {
    const { email, user_password } = req.body;
    console.log(email, user_password);
    try {
        const user = await new Promise((resolve, reject) => {
            db.query("select * from users where email = ? and is_deleted = false", [email], (err, result) => {
                if(err){
                    console.error("Error selecting email:", err);
                    reject(err);
                }
                console.log('result', result);
                resolve(result[0]);
            });
        });
        if(!user){
            return res.status(200).json({ success: false, message: "User not found" });
        }else{
            const isPasswordCorrect = bcrypt.compareSync(user_password, user.user_password);
            if(!isPasswordCorrect){
                return res.status(200).json({success: false, message: "Invalid credentials"});
            }else{
                const token = jwt.sign({id: user.id, email: user.email, full_name: user.full_name}, "g[hc+7^:{%&s<vGPM5sT_Zyash_p_d/4;&f!;umN");
                const {user_password, ...otherDetails} = user;
                res.cookie("access_token", token, {
                    httpOnly: true
                });
                return res.status(200).json({user: otherDetails, token});
            }
        }
    } catch (error) {
        console.error("Error login:", error);
        return res.status(400).json({ success: false, message: "Error signing up", error: error });
    }
}

exports.UpdateRole = async (req, res, next) => {
    try {
        const getUserId = await verifyToken(req, res, next, verifyUser=true);
        console.log('getUser', getUserId);
        const id = req.params.id;
        const getUser = await new Promise((resolve, reject) => {
            db.query("select * from users where id = ?", [getUserId], (err, result) => {
                if (err) {
                    console.error("Error getUser:", err);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
        if(getUser.role !== 3){
            return res.status(400).json({success: false, message: "Permission denied"});
        }else if(!id){
            return res.status(400).json({success: false, message: "Id not found"});
        }else{
            const getSelectedUser = await new Promise((resolve, reject) => {
                db.query("select * from users where id = ?", [id], (err, result) => {
                    if (err) {
                        console.error("Error getSelectedUser:", err);
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                });
            });
            const oldRole = await getRoles(getSelectedUser.role);
            console.log("oldRole", oldRole);
            let string = `You updated the role of [${getSelectedUser.id}] - [${getSelectedUser.full_name}] - [${getSelectedUser.email}] from [${oldRole.name}] to`
            let role = getSelectedUser.role === 2 ? 1 : 2
            const updateRole = await new Promise((resolve, reject) => {
                db.query("update users set role = ? where id = ?", [role, id], (err, result) => {
                    if (err) {
                        console.error("Error updating user role:", err);
                        reject(err);
                    } else {
                        console.log('Role updated successfully', result);
                        resolve(result);
                    }
                });
            });
            const newRole = await getRoles(role);
            req.body.description = `${string} [${newRole.name}]`;
            await Activity_log(req, res, next);
            return res.status(200).json({success: true, message: "Role updated successfully"})
        }
    } catch (error) {
        console.log("error in UpdateRole");
    }
}

const getRoles = async (id) => {
    const getroles = await new Promise((resolve, reject) => {
        db.query("select * from tblroles where id = ?", [id], (err, result) => {
            if (err) {
                console.error("Error selecting user role:", err);
                reject(err);
            } else {
                console.log('Role updated successfully', result);
                resolve(result[0]);
            }
        });
    });
    return getroles;
}