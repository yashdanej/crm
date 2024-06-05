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
    .patch("/last_active", verifyToken, mailController.LastActive)
    .get("/last_active/:userid", verifyToken, mailController.GetLastActive)

    // custom fields
    .get("/get_tables", verifyToken, mailController.GetAllTables) // get all tables
    .patch("/custom_field", verifyToken, mailController.CustomField) // add column
    .patch("/add_custom_value", verifyToken, mailController.CustomFieldValue) // add column
    .get("/get_custom_fields/:table?", verifyToken, mailController.GetCustomFields) // add column

module.exports = router;