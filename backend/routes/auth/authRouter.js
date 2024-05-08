const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth');

router
    .post("/", authController.Signup)

module.exports = router;