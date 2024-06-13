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
        const requiredFields = ["email", "user_password", "full_name", "role", "phone", "designation", "joining_date"];
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
                monthly_salary, leaving_date, emergency_fn, emergency_ln, relationship, emergency_phone, addedfrom)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        // Execute the query
        const getEmp =  await query(sql, [email, hash_password, new Date(), updated_at, full_name, role, phone, getSelectedUser[0]?.company_id,
            facebook, linkedin, skype, pfimage, last_password_change, hourly_rate,
            address, country, state, city, postal_code, birth_date, designation, joining_date,
            monthly_salary, leaving_date, emergency_fn, emergency_ln, relationship, emergency_phone, getUser]);

        // Send success response
        if(getEmp.affectedRows === 1){
            req.body.description = `Added employee name: ${full_name} and id: ${getEmp.insertId} by user id ${getUser}`;
            await Activity_log(req, res, next);
            const empData = await query("select * from users where id = ?", [getEmp.insertId]);
            return res.status(200).json({success: true, message: "Note added successfully", data: empData});
        }else{
            return res.status(200).json({ success: false, message: "Error adding employee", data: [] });
        }
    } catch (error) {
        console.log("error in AddEmployee", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getEmployees = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const selectedUser = await query("select * from users where id = ? and is_deleted = ?", [getUser, false]);
        // Execute a query to fetch employee records from the database
        const employees = await query("SELECT * FROM users WHERE company_id = ? and id != ? and is_deleted = ?", [selectedUser[0].company_id, getUser, false]);

        // Check if any employees were found
        if (employees.length === 0) {
            return res.status(404).json({ success: false, message: "No employees found", data: [] });
        }

        // Send the list of employees as the response
        return res.status(200).json({ success: true, message: "Employees fetched successfully", data: employees });
    } catch (error) {
        console.log("Error in getEmployees", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getEmployee = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const selectedUser = await query("select * from users where id = ? and is_deleted = ?", [getUser, false]);
        const emp_id = req.params.emp_id;
        // Execute a query to fetch employee records from the database
        const employee = await query("SELECT * FROM users WHERE company_id = ? and id = ? and is_deleted = ?", [selectedUser[0].company_id, emp_id, false]);

        // Check if any employee were found
        if (employee.length === 0) {
            return res.status(404).json({ success: false, message: "No employee found" });
        }

        // Send the list of employee as the response
        return res.status(200).json({ success: true, message: "Employee fetched successfully", data: employee });
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
        const requiredFields = ["email", "full_name", "role", "phone", "designation", "joining_date"];
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

exports.deleteEmployeeAndDetail = async (req, res, next) => {
    try {
        const emp_id = req.params.emp_id;
        // Execute a query to fetch employee records from the database
        await query("update users set is_deleted = ? WHERE id = ?", [true, emp_id]);
        await query("update emp_details set is_deleted = ? WHERE user_id = ?", [true, emp_id]);

        // Send the list of employee as the response
        return res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        console.log("Error in getEmployee", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.addEmployeeDetail = async (req, res, next) => {
    try {
        const emp_id = req.params.emp_id;
        const existingUser = await query("select * from emp_details where user_id = ?", [emp_id]);
        if(existingUser.length > 0){
            return res.status(200).json({success: false, message: "Employee detail already exist!"})
        }
        const {
            pf_number,
            aadhar_number,
            passport,
            passport_authority,
            visa,
            visa_authority,
            eid,
            eid_authority,
            bank_name,
            account_holder_name,
            bank_ifsc_code,
            esi_number,
            driving_licence_no,
            passport_date_from,
            passport_date_to,
            visa_date,
            eid_date_from,
            eid_date_to,
            bank_branch,
            bank_acount_no
        } = req.body;

        // Add validation rules as needed for specific fields

        // Construct the SQL query
        const sql = `
            INSERT INTO emp_details (
                pf_number,
                aadhar_number,
                passport,
                passport_authority,
                visa,
                visa_authority,
                eid,
                eid_authority,
                bank_name,
                account_holder_name,
                bank_ifsc_code,
                esi_number,
                driving_licence_no,
                passport_date_from,
                passport_date_to,
                visa_date,
                eid_date_from,
                eid_date_to,
                bank_branch,
                bank_acount_no,
                user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        // Execute the query
        await query(sql, [
            pf_number,
            aadhar_number,
            passport,
            passport_authority,
            visa,
            visa_authority,
            eid,
            eid_authority,
            bank_name,
            account_holder_name,
            bank_ifsc_code,
            esi_number,
            driving_licence_no,
            passport_date_from,
            passport_date_to,
            visa_date,
            eid_date_from,
            eid_date_to,
            bank_branch,
            bank_acount_no,
            emp_id
        ]);

        return res.status(200).json({ success: true, message: "Employee detail added successfully" });
    } catch (error) {
        console.log("Error in addEmployeeDetail", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getEmployeeDetails = async (req, res, next) => {
    try {
        const emp_id = req.params.emp_id;
        // Execute a query to fetch employee records from the database
        const employee = await query("SELECT * FROM emp_details WHERE user_id = ? and is_deleted = ?", [emp_id, false]);

        // Check if any employee were found
        if (employee.length === 0) {
            return res.status(404).json({ success: false, message: "No employee detail found" });
        }

        // Send the list of employee as the response
        return res.status(200).json({ success: true, message: "Employee details fetched successfully", date: employee });
    } catch (error) {
        console.log("Error in getEmployee", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateEmployeeDetail = async (req, res, next) => {
    try {
        const detail_id = req.params.detail_id;
        const getDetailId = await query("select * from emp_details where id = ?", [detail_id]);
        if(!getDetailId.length > 0){
            return res.status(404).json({success: false, message: "No Employee detail found!"});
        }
        const {
            pf_number,
            aadhar_number,
            passport,
            passport_authority,
            visa,
            visa_authority,
            eid,
            eid_authority,
            bank_name,
            account_holder_name,
            bank_ifsc_code,
            esi_number,
            driving_licence_no,
            passport_date_from,
            passport_date_to,
            visa_date,
            eid_date_from,
            eid_date_to,
            bank_branch,
            bank_acount_no
        } = req.body;

        // Add validation rules as needed for specific fields

        // Construct the SQL query for updating employee detail
        const sql = `
            UPDATE emp_details
            SET pf_number=?,
                aadhar_number=?,
                passport=?,
                passport_authority=?,
                visa=?,
                visa_authority=?,
                eid=?,
                eid_authority=?,
                bank_name=?,
                account_holder_name=?,
                bank_ifsc_code=?,
                esi_number=?,
                driving_licence_no=?,
                passport_date_from=?,
                passport_date_to=?,
                visa_date=?,
                eid_date_from=?,
                eid_date_to=?,
                bank_branch=?,
                bank_acount_no=?
            WHERE id=?;
        `;

        // Execute the query
        await query(sql, [
            pf_number,
            aadhar_number,
            passport,
            passport_authority,
            visa,
            visa_authority,
            eid,
            eid_authority,
            bank_name,
            account_holder_name,
            bank_ifsc_code,
            esi_number,
            driving_licence_no,
            passport_date_from,
            passport_date_to,
            visa_date,
            eid_date_from,
            eid_date_to,
            bank_branch,
            bank_acount_no,
            detail_id
        ]);

        return res.status(200).json({ success: true, message: "Employee detail updated successfully" });
    } catch (error) {
        console.log("Error in updateEmployeeDetail", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};