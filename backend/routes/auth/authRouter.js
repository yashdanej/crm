const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth');

router
    .post("/signup", authController.Signup)
    .post("/login", authController.Login)

module.exports = router;