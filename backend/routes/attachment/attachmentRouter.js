const express = require('express');
const router = express.Router();
const atachmentController = require('../../controllers/attachment/attachmnt');
const { verifyToken } = require('../../middleware/verifyToken');
const { upload, xlsxUpload } = require('../../middleware/upload');

router
    .post("/add_attachment/:rel_id", verifyToken, upload.single("file"), atachmentController.Attachment)
    .get("/:rel_id", verifyToken, atachmentController.GetAttachment)

module.exports = router;