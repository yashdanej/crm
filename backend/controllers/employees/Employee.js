const db = require("../../db");
const { verifyToken } = require("../../middleware/verifyToken");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary");
const util = require("util");
const { Activity_log, getColumn, CustomFieldValue, MailSend, SendWhatsappMessage } = require("../utils/util");
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
        console.log("in----------");
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
        console.log("emptyFields", emptyFields);
        if (emptyFields.length > 0) {
            return handleErrorResponse(res, 200, `Empty values found for fields: ${emptyFields.join(", ")}`);
        }

        // Validate phone number format
        if (!validatePhoneNumber(phone)) {
            return handleErrorResponse(res, 200, "Invalid phone number format. Please provide a 10-digit phone number.");
        }

        if (emergency_phone && emergency_phone !== "" && !validatePhoneNumber(emergency_phone)) {
            return handleErrorResponse(res, 200, "Invalid emergency phone number format. Please provide a 10-digit phone number.");
        }

        // Check if the email already exists
        const existingUser = await query("SELECT * FROM users WHERE email = ? and company_id = ? and is_deleted = ?", [email, getSelectedUser[0].company_id, false]);
        if (existingUser.length > 0) {
            return handleErrorResponse(res, 200, "Email already exists. Please use a different email address.");
        }
        let result;
        if(req.file && req.file.path){
            result = await cloudinary.uploader.upload(req.file.path, {
                folder: "crm",
                resource_type: "auto"
            });
        }
        console.log("in2----------");
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
        
            // custom field
            const Column = await getColumn(req, res, next, "users");
            console.log("Column", Column);
            let missingFields = [];
            if (Column != undefined && Column && Column.length > 0) {
                for (const element of Column) {
                    const value = req.body[element.name];
                    console.log("value", value);
                    if(element.required){
                        if (!value || value == undefined) {
                            missingFields.push(`Give value to custom field ${element.name}`);
                        }else{
                            await CustomFieldValue(req, res, next, getEmp.insertId, element.id, element.fieldto, value);    
                        }  
                    }else {
                        if (value && value != undefined) {
                            await CustomFieldValue(req, res, next, getEmp.insertId, element.id, element.fieldto, value);
                        }
                    }
                }
            }

            if (missingFields.length > 0) {
                console.log("in missignfiels");
                req.body.emp_id = getEmp.insertId;
                await this.deleteEmployeeAndDetail(req, res, next);
                return res.status(200).json({ success: false, message: missingFields.join(", ") });
            } else {
                // Send success response
                if(getEmp.affectedRows === 1){
                    const company = await query("select * from company where id = ?", getSelectedUser[0].company_id);
                    const des = await query("select * from designation where id = ?", designation);
                    req.body.description = `Added employee name: ${full_name} and id: ${getEmp.insertId} by user id ${getUser}`;
                    await Activity_log(req, res, next);
                    req.body.from = "employee";
                    req.body.name = full_name;
                    req.body.phone = phone;
                    req.body.company_name = company[0].name;
                    req.body.designation = des[0].name;
                    req.body.email = email;
                    // mail sending
                    MailSend(req, res, next);
                    // whatsapp message sending
                    SendWhatsappMessage(req, res, next);
                    const empData = await query("select * from users where id = ?", [getEmp.insertId]);
                    return res.status(200).json({success: true, message: "Employee added successfully", data: empData});
                }else{
                    return res.status(200).json({ success: false, message: "Error adding employee", data: [] });
                }
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
            facebook, linkedin, skype, user_password, last_password_change, hourly_rate,
            address, country, state, city, postal_code, birth_date, designation, joining_date,
            monthly_salary, leaving_date, emergency_fn, emergency_ln, relationship, emergency_phone } = req.body;
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const getSelectedUser = await query("SELECT * FROM users WHERE id = ?", [getUser]);
        const emp_id = req.params.emp_id;
        let result;
        if(req.file && req.file.path){
            result = await cloudinary.uploader.upload(req.file.path, {
                folder: "crm",
                resource_type: "auto"
            });
        }
        // Validate required fields and empty values
        console.log("email", email);
        const requiredFields = ["email", "full_name", "role", "phone", "designation", "joining_date"];
        const emptyFields = requiredFields.filter(field => !req.body[field] || req.body[field] === "");

        if (emptyFields.length > 0) {
            return handleErrorResponse(res, 200, `Empty values found for fields: ${emptyFields.join(", ")}`);
        }

        // Validate phone number format
        if (!validatePhoneNumber(phone)) {
            return handleErrorResponse(res, 200, "Invalid phone number format. Please provide a 10-digit phone number.");
        }

        if (emergency_phone && emergency_phone !== "" && !validatePhoneNumber(emergency_phone)) {
            return handleErrorResponse(res, 200, "Invalid emergency phone number format. Please provide a 10-digit phone number.");
        }

        // Check if the employee exists
        const existingEmployee = await query("SELECT * FROM users WHERE id = ?", [emp_id]);
        if (existingEmployee.length === 0) {
            return handleErrorResponse(res, 200, "Employee not found");
        }

        // Check if the email already exists
        const existingUser = await query("SELECT * FROM users WHERE email = ? and company_id = ? and id != ? and is_deleted = ?", [email, getSelectedUser[0].company_id, emp_id, false]);
        console.log("existingUser-----", existingUser);
        if (existingUser.length > 0) {
            return handleErrorResponse(res, 200, "Email already exists. Please use a different email address.");
        }

        // Custome field

        const Column = await getColumn(req, res, next, "users");
        console.log("Column", Column);
        let missingFields = [];
        if (Column != undefined && Column && Column.length > 0) {
            for (const element of Column) {
                const value = req.body[element.name];
                console.log("value", value);
                if(element.required){
                    if (!value || value == undefined) {
                        missingFields.push(`Give value to custom field ${element.name}`);
                    }else{
                        await CustomFieldValue(req, res, next, emp_id, element.id, element.fieldto, value, "update", element.name);
                    }  
                }else {
                    if (value && value != undefined) {
                        await CustomFieldValue(req, res, next, emp_id, element.id, element.fieldto, value, "update", element.name);
                    }
                }
            }
        }

        if (missingFields.length > 0) {
            req.body.id = id;
            return res.status(200).json({ success: false, message: missingFields.join(", ") });
        }

        // Check if the previous password matches the newly entered password
        const previousPassword = existingEmployee[0].user_password;
        console.log("previousPassword", previousPassword);
        console.log("user_password", user_password);
        const joiningDate = new Date(joining_date).toISOString().slice(0, 19).replace('T', ' ');
        // Construct the SQL query for updating employee details
        let sql;
        const currentDate = new Date();
        const queryParamsBase = [email, full_name, role, phone, facebook, linkedin, skype, hourly_rate,
            address, country, state, city, postal_code, birth_date, designation, joiningDate,
            monthly_salary, leaving_date, emergency_fn, emergency_ln, relationship, emergency_phone, currentDate, emp_id];

        if (user_password !== previousPassword) {
            console.log("in+-------------");
            // Password does not match, update the password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(user_password, salt);
            queryParamsBase.splice(7, 0, hashedPassword, currentDate);  // Insert hashed password and last password change date at correct positions
            
            if (req.file && req.file.path) {
                queryParamsBase.push(result.secure_url);  // Add the profile_img at the end
                sql = `
                    UPDATE users 
                    SET email=?, full_name=?, role=?, phone=?, facebook=?, linkedin=?, skype=?, user_password=?, last_password_change=?,
                        hourly_rate=?, address=?, country=?, state=?, city=?, postal_code=?, birth_date=?, designation=?, joining_date=?,
                        monthly_salary=?, leaving_date=?, emergency_fn=?, emergency_ln=?, relationship=?, emergency_phone=?, updated_at=?, profile_img=?
                    WHERE id=?;
                `;
            } else {
                sql = `
                    UPDATE users 
                    SET email=?, full_name=?, role=?, phone=?, facebook=?, linkedin=?, skype=?, user_password=?, last_password_change=?,
                        hourly_rate=?, address=?, country=?, state=?, city=?, postal_code=?, birth_date=?, designation=?, joining_date=?,
                        monthly_salary=?, leaving_date=?, emergency_fn=?, emergency_ln=?, relationship=?, emergency_phone=?, updated_at=?
                    WHERE id=?;
                `;
            }
        } else {
            console.log("out+-------------");
            // Password matches, do not update the password
            if (req.file && req.file.path) {
                queryParamsBase.splice(7, 0, currentDate);  // Insert last password change date at the correct position
                queryParamsBase.push(result.secure_url);  // Add the profile_img at the end
                sql = `
                    UPDATE users 
                    SET email=?, full_name=?, role=?, phone=?, facebook=?, linkedin=?, skype=?, last_password_change=?,
                        hourly_rate=?, address=?, country=?, state=?, city=?, postal_code=?, birth_date=?, designation=?, joining_date=?,
                        monthly_salary=?, leaving_date=?, emergency_fn=?, emergency_ln=?, relationship=?, emergency_phone=?, updated_at=?, profile_img=?
                    WHERE id=?;
                `;
            } else {
                queryParamsBase.splice(7, 0, currentDate);  // Insert last password change date at the correct position
                sql = `
                    UPDATE users 
                    SET email=?, full_name=?, role=?, phone=?, facebook=?, linkedin=?, skype=?, last_password_change=?,
                        hourly_rate=?, address=?, country=?, state=?, city=?, postal_code=?, birth_date=?, designation=?, joining_date=?,
                        monthly_salary=?, leaving_date=?, emergency_fn=?, emergency_ln=?, relationship=?, emergency_phone=?, updated_at=?
                    WHERE id=?;
                `;
            }
        }

        // Execute the query
        await query(sql, queryParamsBase);

        // Send success response
        return res.status(200).json({ success: true, message: "Employee updated successfully" });
    } catch (error) {
        console.log("Error in updateEmployee", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.deleteEmployeeAndDetail = async (req, res, next) => {
    try {
        console.log("in deleteEmployeeAndDetail");
        const emp_id = req.params.emp_id?req.params.emp_id:req.body.emp_id;
        if(!emp_id){
            return res.status(400).json({ success: false, message: "No id provided" });
        }
        // Execute a query to fetch employee records from the database
        await query("update users set is_deleted = ? WHERE id = ?", [true, emp_id]);
        await query("update emp_details set is_deleted = ? WHERE user_id = ?", [true, emp_id]);

        // Send the list of employee as the response
        req.body.description = `Deleted employee id: [${emp_id}]`;
        await Activity_log(req, res, next);
        if(req.body.emp_id){
            return
        }else{
            return res.status(200).json({ success: true, message: "Employee deleted successfully" });
        }
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
        let {
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
        if(passport_date_from == ""){
            passport_date_from = null;
        }
        if(passport_date_to == ""){
            passport_date_to = null;
        }
        if(visa_date == ""){
            visa_date = null;
        }
        if(eid_date_from == ""){
            eid_date_from = null;
        }
        if(eid_date_to == ""){
            eid_date_to = null;
        }
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
        const empDetail = await query(sql, [
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
        if(empDetail.affectedRows === 1){
            req.body.description = `Added employee detail to employee id: ${emp_id}`;
            await Activity_log(req, res, next);
            const empDetails = await query("select * from users where id = ?", [empDetail.insertId]);
            return res.status(200).json({success: true, message: "Employee detail added successfully", data: empDetails});
        }else{
            return res.status(200).json({ success: false, message: "Error adding employee detail", data: [] });
        }
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
        return res.status(200).json({ success: true, message: "Employee details fetched successfully", data: employee });
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

exports.addOrUpdateEmployeeDetail = async (req, res, next) => {
    try {
        const emp_id = req.params.emp_id;
        const existingDetails = await query("SELECT * FROM emp_details WHERE user_id = ?", [emp_id]);

        let {
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

        // Set empty date fields to null
        passport_date_from = passport_date_from || null;
        passport_date_to = passport_date_to || null;
        visa_date = visa_date || null;
        eid_date_from = eid_date_from || null;
        eid_date_to = eid_date_to || null;

        if (existingDetails.length > 0) {
            // Employee details exist, update them
            const detail_id = existingDetails[0].id;

            const sqlUpdate = `
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

            await query(sqlUpdate, [
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

            req.body.description = `Updated employee detail for employee id: ${emp_id}`;
            await Activity_log(req, res, next);

            return res.status(200).json({ success: true, message: "Employee detail updated successfully" });

        } else {
            // Employee details do not exist, add new details
            const sqlInsert = `
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

            const empDetail = await query(sqlInsert, [
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

            if (empDetail.affectedRows === 1) {
                req.body.description = `Added employee detail for employee id: ${emp_id}`;
                await Activity_log(req, res, next);

                const newEmpDetails = await query("SELECT * FROM emp_details WHERE id = ?", [empDetail.insertId]);
                console.log("newEmpDetails", newEmpDetails);
                return res.status(200).json({ success: true, message: "Employee detail added successfully", data: newEmpDetails });
            } else {
                return res.status(200).json({ success: false, message: "Error adding employee detail", data: [] });
            }
        }
    } catch (error) {
        console.log("Error in addOrUpdateEmployeeDetail", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};