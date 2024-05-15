const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/signup", authController.Signup)
    .post("/login", authController.Login)
    .patch("/updaterole/:id", verifyToken, authController.UpdateRole)

module.exports = router;