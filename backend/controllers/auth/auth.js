const bcrypt = require("bcrypt");
const db = require("../../db");
const jwt = require("jsonwebtoken");

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
                return res.cookie("access_token", token, {
                    httpOnly: true
                }).status(200).json({user: otherDetails, token});
            }
        }
    } catch (error) {
        console.error("Error login:", error);
        return res.status(400).json({ success: false, message: "Error signing up", error: error });
    }
}
