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

module.exports = router;