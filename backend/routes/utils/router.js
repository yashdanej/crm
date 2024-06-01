const express = require('express');
const router = express.Router();
const mailController = require('../../controllers/utils/util');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/sendmail", verifyToken, mailController.MailSend)
    .post("/whatsapp", verifyToken, mailController.SendWhatsappMessage)
    .post("/activity_log", verifyToken, mailController.Activity_log)
    .get("/user_activity/:userid", verifyToken, mailController.UserActivity)
    .get("/lead_activity/:leadid", verifyToken, mailController.LeadActivity)

module.exports = router;