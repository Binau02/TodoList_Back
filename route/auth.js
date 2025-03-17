const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const {verifyToken} = require("../middleware/authMiddleware");


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('', verifyToken, authController.isLoggedIn)

module.exports = router;
