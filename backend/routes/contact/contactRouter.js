const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contact/contact');
const { verifyToken } = require('../../middleware/verifyToken');
const { upload } = require('../../middleware/upload');

router
    .post("/", verifyToken, upload.single("profile_image"), contactController.createContact)
    .get("/:customer_id", verifyToken, contactController.getContacts)
    .get("/:id", verifyToken, contactController.getContactById)
    .patch("/:id", verifyToken, upload.single("profile_image"), contactController.updateContact)
    .delete("/:id", verifyToken, contactController.deleteContact)

module.exports = router;