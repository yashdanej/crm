const express = require('express');
const router = express.Router();
const mailController = require('../../controllers/utils/util');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .get("/roles", verifyToken, mailController.getRoles)
    .post("/sendmail", verifyToken, mailController.MailSend)
    .post("/whatsapp", verifyToken, mailController.SendWhatsappMessage)
    .post("/activity_log", verifyToken, mailController.Activity_log)
    .get("/user_activity/:userid", verifyToken, mailController.UserActivity)
    .get("/lead_activity/:leadid", verifyToken, mailController.LeadActivity)
    .patch("/last_active", verifyToken, mailController.LastActive)
    .get("/last_active/:userid", verifyToken, mailController.GetLastActive)

    // custom fields
    .get("/get_tables", verifyToken, mailController.GetAllTables) // get all tables
    .patch("/custom_field", verifyToken, mailController.CustomField) // add custom field
    .patch("/add_custom_value", verifyToken, mailController.CustomFieldValue) // add value
    .get("/get_custom_fields/:active?/:table?", verifyToken, mailController.GetCustomFields) // get custom fields and with table also
    .patch("/change_custom_field_active/:fieldid", verifyToken, mailController.ChangeCustomFieldActive) // get custom fields and with table also
    .delete("/delete_custom_field/:fieldid", verifyToken, mailController.DeleteCustomField) // delete custom fields and with table also
    .get("/get_custom_field/:fieldid", verifyToken, mailController.EditCustomField) // get custom fields and with table also
    .patch("/update_custom_field/:fieldid", verifyToken, mailController.UpdateCustomField) // get custom fields and with table also

module.exports = router;