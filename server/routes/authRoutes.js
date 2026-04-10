const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, forgotPassword, verifyForgotOTP, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyForgotOTP);
router.post('/reset-password', resetPassword);

module.exports = router;

