const express = require('express');
const router = express.Router();
const developerController = require('../../controllers/developer/developer');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/company", verifyToken, developerController.addCompany)
    .get("/company", verifyToken, developerController.getCompany)
    .post("/superadmin", verifyToken, developerController.SuperAdmin)
    .get("/superadmins", verifyToken, developerController.getSuperAdmins)

module.exports = router;