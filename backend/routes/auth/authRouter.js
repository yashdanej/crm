const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/signup", authController.Signup)
    .post("/login", authController.Login) // activity
    .patch("/updaterole/:id", verifyToken, authController.UpdateRole) // activity

module.exports = router;