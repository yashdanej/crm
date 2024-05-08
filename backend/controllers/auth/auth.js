const bcrypt = require("bcrypt");
const db = require("../../db");

exports.Signup = async (req, res) => {
    const { email, user_password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash_password = bcrypt.hashSync(user_password, salt);
    try {
        // Check if email already exists
        db.query("SELECT email FROM users WHERE email = ?", [email], (err, existingEmail) => {
            if(err){
                console.log("error in select email", err);
                return res.status(400).json({ success: false, message: "Error selecting email", error: err });
            }
            console.log('existingEmail', existingEmail);
            if (existingEmail.length > 0) {
                return res.status(200).json({ success: false, message: "Email already exists" });
            }

            // If email doesn't exist, insert new user
            db.query("INSERT INTO users SET ?", { email, user_password: hash_password }, (err, result) => {
                if(err){
                    console.error("Error inserting user:", err);
                    return res.status(400).json({ success: false, message: "Error inserting user", error: err });
                }
                console.log("User inserted:", result);
                return res.status(200).json({ success: true, message: "User signed up successfully" });
            });
        });
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(400).json({ success: false, message: "Error signing up", error: error });
    }
};

exports.Login = async (req, res) => {
    const { email, user_password } = req.body;
    try {
        db.query("select email, user_password from user where email = ?", [email], (err, result) => {
            if(err){
                console.error("Error selecting email:", err);
                return res.status(400).json({ success: false, message: "Error selecting email", error: err });
            }
            console.log('result', result);
        });
    } catch (error) {
        console.error("Error login:", error);
        return res.status(400).json({ success: false, message: "Error signing up", error: error });
    }
}
