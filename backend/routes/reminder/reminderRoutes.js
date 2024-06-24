const express = require('express');
const router = express.Router();
const reminderController = require('../../controllers/reminder/reminder');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/addreminder/:rel_id", verifyToken, reminderController.addReminder) // done
    .get("/:rel_id/:rel_type", verifyToken, reminderController.getReminder) // done

module.exports = router;