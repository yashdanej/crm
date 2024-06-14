const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employees/Employee');
const { verifyToken } = require('../../middleware/verifyToken');
const { upload } = require('../../middleware/upload');

router
    .post("/", verifyToken, upload.single("profile_img"), employeesController.AddEmployee)
    .get("/", verifyToken, employeesController.getEmployees)
    .get("/:emp_id", verifyToken, employeesController.getEmployee)
    .patch("/:emp_id", verifyToken, upload.single("profile_img"), employeesController.updateEmployee)
    .delete("/:emp_id", verifyToken, employeesController.deleteEmployeeAndDetail)
    
    .post("/emp_detail/:emp_id", verifyToken, employeesController.addOrUpdateEmployeeDetail)
    // Employee details
    .post("/detail/:emp_id", verifyToken, employeesController.addEmployeeDetail)
    .get("/detail/:emp_id", verifyToken, employeesController.getEmployeeDetails)
    .patch("/detail/:detail_id", verifyToken, employeesController.updateEmployeeDetail)

module.exports = router;