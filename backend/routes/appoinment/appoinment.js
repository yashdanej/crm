const express = require('express');
const router = express.Router();
const appoinmentController = require('../../controllers/appoinment/appoinment');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/", verifyToken, appoinmentController.createAppointment) // done

module.exports = router;