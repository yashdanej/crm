const express = require('express');
const router = express.Router();
const mailController = require('../../controllers/utils/MailSend');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/sendmail", verifyToken, mailController.MailSend)
    .post("/whatsapp", verifyToken, mailController.SendWhatsappMessage)

module.exports = router;