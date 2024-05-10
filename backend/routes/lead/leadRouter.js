const express = require('express');
const router = express.Router();
const leadController = require('../../controllers/lead/lead');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/newlead", verifyToken, leadController.NewLead)

module.exports = router;