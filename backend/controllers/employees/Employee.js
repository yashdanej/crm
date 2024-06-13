const db = require("../../db");
const { verifyToken } = require("../../middleware/verifyToken");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary");
const util = require("util");
const { Activity_log } = require("../utils/util");
const query = util.promisify(db.query).bind(db);

// Extracted function to validate phone number format
const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/; // Regular expression for a 10-digit phone number
    return phoneRegex.test(phoneNumber);
};

// Extracted function to handle error responses
const handleErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ success: false, message });
};

exports.AddEmployee = async (req, res, next) => {
    try {
        // Extract employee data from request body
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const getSelectedUser = await query("select * from users where id = ?", [getUser]);
        const { email, user_password, created_at, updated_at, full_name, role, phone,
            facebook, linkedin, skype, last_password_change, hourly_rate,
            address, country, state, city, postal_code, birth_date, designation, joining_date,
            monthly_salary, leaving_date, emergency_fn, emergency_ln, relationship, emergency_phone } = req.body;

        // Validate required fields and empty values
        const requiredFields = ["email", "user_password", "full_name", "address", "role", "phone", "designation", "joining_date"];
        const emptyFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === "");

        if (emptyFields.length > 0) {
            return handleErrorResponse(res, 400, `Empty values found for fields: ${emptyFields.join(", ")}`);
        }

        // Validate phone number format
        if (!validatePhoneNumber(phone)) {
            return handleErrorResponse(res, 400, "Invalid phone number format. Please provide a 10-digit phone number.");
        }

        if (emergency_phone && emergency_phone !== "" && !validatePhoneNumber(emergency_phone)) {
            return handleErrorResponse(res, 400, "Invalid emergency phone number format. Please provide a 10-digit phone number.");
        }

        // Check if the email already exists
        const existingUser = await query("SELECT * FROM users WHERE email = ? and company_id = ?", [email, getSelectedUser[0].company_id]);
        if (existingUser.length > 0) {
            return handleErrorResponse(res, 400, "Email already exists. Please use a different email address.");
        }
        let result;
        if(req.file && req.file.path){
            result = await cloudinary.uploader.upload(req.file.path, {
                folder: "crm",
                resource_type: "auto"
            });
        }
        const pfimage = result?.secure_url;
        // Password hashing
        const salt = bcrypt.genSaltSync(10);
        const hash_password = bcrypt.hashSync(user_password, salt);

        // Construct the SQL query
        const sql = `
            INSERT INTO users (email, user_password, created_at, updated_at, full_name, role, phone, company_id,
                facebook, linkedin, skype, profile_img, last_password_change, hourly_rate,
                address, country, state, city, postal_code, birth_date, designation, joining_date,
                monthly_salary, leaving_date, emergency_fn, emergency_ln, relationship, emergency_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?);
        `;

        // Execute the query
        await query(sql, [email, hash_password, new Date(), updated_at, full_name, role, phone, getSelectedUser[0]?.company_id,
            facebook, linkedin, skype, pfimage, last_password_change, hourly_rate,
            address, country, state, city, postal_code, birth_date, designation, joining_date,
            monthly_salary, leaving_date, emergency_fn, emergency_ln, relationship, emergency_phone]);

        // Send success response
        return res.status(200).json({ success: true, message: "Employee added successfully" });
    } catch (error) {
        console.log("error in AddEmployee", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getEmployees = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const selectedUser = await query("select * from users where id = ?", [getUser]);
        // Execute a query to fetch employee records from the database
        const employees = await query("SELECT * FROM users WHERE company_id = ? and id != ?", [selectedUser[0].company_id, getUser]);

        // Check if any employees were found
        if (employees.length === 0) {
            return res.status(404).json({ success: false, message: "No employees found" });
        }

        // Send the list of employees as the response
        return res.status(200).json({ success: true, message: "Employees fetched successfully", date: employees });
    } catch (error) {
        console.log("Error in getEmployees", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getEmployee = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const selectedUser = await query("select * from users where id = ?", [getUser]);
        const emp_id = req.params.emp_id;
        // Execute a query to fetch employee records from the database
        const employee = await query("SELECT * FROM users WHERE company_id = ? and id = ?", [selectedUser[0].company_id, emp_id]);

        // Check if any employee were found
        if (employee.length === 0) {
            return res.status(404).json({ success: false, message: "No employee found" });
        }

        // Send the list of employee as the response
        return res.status(200).json({ success: true, message: "Employee fetched successfully", date: employee });
    } catch (error) {
        console.log("Error in getEmployee", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateEmployee = async (req, res, next) => {
    try {
        // Extract employee data from request body
        console.log("req.body", req.body);
        const { email, full_name, role, phone,
            facebook, linkedin, skype, last_password_change, hourly_rate,
            address, country, state, city, postal_code, birth_date, designation, joining_date,
            monthly_salary, leaving_date, emergency_fn, emergency_ln, relationship, emergency_phone } = req.body;
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const getSelectedUser = await query("SELECT * FROM users WHERE id = ?", [getUser]);
        const emp_id = req.params.emp_id;

        // Validate required fields and empty values
        console.log("email", email);
        const requiredFields = ["email", "full_name", "address", "role", "phone", "designation", "joining_date"];
        const emptyFields = requiredFields.filter(field => !req.body[field] || req.body[field] === "");

        if (emptyFields.length > 0) {
            return handleErrorResponse(res, 400, `Empty values found for fields: ${emptyFields.join(", ")}`);
        }

        // Validate phone number format
        if (!validatePhoneNumber(phone)) {
            return handleErrorResponse(res, 400, "Invalid phone number format. Please provide a 10-digit phone number.");
        }

        if (emergency_phone && emergency_phone !== "" && !validatePhoneNumber(emergency_phone)) {
            return handleErrorResponse(res, 400, "Invalid emergency phone number format. Please provide a 10-digit phone number.");
        }

        // Check if the employee exists
        const existingEmployee = await query("SELECT * FROM users WHERE id = ?", [emp_id]);
        if (existingEmployee.length === 0) {
            return handleErrorResponse(res, 404, "Employee not found");
        }

        // Check if the email already exists
        const existingUser = await query("SELECT * FROM users WHERE email = ? and company_id = ? and id != ?", [email, getSelectedUser[0].company_id, existingEmployee[0].id]);
        if (existingUser.length > 0) {
            return handleErrorResponse(res, 400, "Email already exists. Please use a different email address.");
        }

        // Construct the SQL query for updating employee details
        const sql = `
            UPDATE users 
            SET email=?, full_name=?, role=?, phone=?, facebook=?, linkedin=?, skype=?, last_password_change=?, hourly_rate=?,
                address=?, country=?, state=?, city=?, postal_code=?, birth_date=?, designation=?, joining_date=?,
                monthly_salary=?, leaving_date=?, emergency_fn=?, emergency_ln=?, relationship=?, emergency_phone=?, updated_at=?
            WHERE id=?;
        `;

        // Execute the query
        await query(sql, [email, full_name, role, phone, facebook, linkedin, skype, last_password_change, hourly_rate,
            address, country, state, city, postal_code, birth_date, designation, joining_date,
            monthly_salary, leaving_date, emergency_fn, emergency_ln, relationship, emergency_phone, new Date(), emp_id]);

        // Send success response
        return res.status(200).json({ success: true, message: "Employee updated successfully" });
    } catch (error) {
        console.log("Error in updateEmployee", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};