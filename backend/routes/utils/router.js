const express = require('express');
const router = express.Router();
const mailController = require('../../controllers/utils/sendmail');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .get("/sendmail", verifyToken, mailController.SendMail)

module.exports = router;