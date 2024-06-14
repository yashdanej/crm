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

    // grp
    .post("/grp", verifyToken, mailController.createGrpName)
    .get("/grp", verifyToken, mailController.getAllGrpNames)
    .get("/grp/:id", verifyToken, mailController.getGrpNameById)
    .patch("/grp/:id", verifyToken, mailController.updateGrpName)
    .delete("/grp/:id", verifyToken, mailController.deleteGrpName)

     // it status
     .post("/it_status", verifyToken, mailController.createItStatus)
     .get("/it_status", verifyToken, mailController.getAllItStatus)
     .get("/it_status/:id", verifyToken, mailController.getItStatusById)
     .patch("/it_status/:id", verifyToken, mailController.updateItStatus)
     .delete("/it_status/:id", verifyToken, mailController.deleteItStatus)

     // master type
     .post("/master_type", verifyToken, mailController.createMasterType)
     .get("/master_type", verifyToken, mailController.getAllMasterTypes)
     .get("/master_type/:id", verifyToken, mailController.getMasterTypeById)
     .patch("/master_type/:id", verifyToken, mailController.updateMasterType)
     .delete("/master_type/:id", verifyToken, mailController.deleteMasterType)

     // currency_master
     .post("/currency_master", verifyToken, mailController.createCurrency)
     .get("/currency_master", verifyToken, mailController.getCurrency)
     .get("/currency_master/:id", verifyToken, mailController.getCurrencyById)
     .patch("/currency_master/:id", verifyToken, mailController.updateCurrency)
     .delete("/currency_master/:id", verifyToken, mailController.deleteCurrency)

module.exports = router;