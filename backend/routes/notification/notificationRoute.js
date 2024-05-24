const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification/notification');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/addnotification/:receiveid", verifyToken, notificationController.AddNotification)
    .get("/getnotification", verifyToken, notificationController.GetNotification)
    .get("/getusernotification", verifyToken, notificationController.GetUserNotification)
    .patch("/seen/:notificationid", verifyToken, notificationController.SeenNotification)

module.exports = router;