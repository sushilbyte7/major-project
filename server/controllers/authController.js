const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { sendOTPEmail, sendForgotPasswordOTPEmail } = require('../utils/emailService');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register - Step 1: Save user (unverified) & send OTP
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Check if a VERIFIED user already exists with this email
        const existingVerifiedUser = await User.findOne({ email, isVerified: true });
        if (existingVerifiedUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Delete any unverified user with same email (retry attempt)
        await User.deleteOne({ email, isVerified: false });

        // Create user as unverified
        const user = await User.create({ name, email, password, phone, address, isVerified: false });

        // Generate OTP
        const otp = generateOTP();

        // Delete old OTPs for this email
        await OTP.deleteMany({ email });

        // Save OTP
        await OTP.create({ email, otp });

        // Send OTP email
        await sendOTPEmail(email, otp, name);

        res.status(201).json({
            message: 'OTP sent to your email. Please verify to activate your account.',
            email,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register - Step 2: Verify OTP → activate account & return token
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired. Please register again.' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // Mark user as verified
        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { returnDocument: 'after' }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register again.' });
        }

        // Delete OTP record
        await OTP.deleteMany({ email });

        // Return token — user is now logged in
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password - Step 1: Send OTP to email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email, isVerified: true });
        if (!user) {
            return res.status(404).json({ message: 'No verified account found with this email' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete old reset OTPs for this email
        await OTP.deleteMany({ email, purpose: 'reset' });

        // Save OTP with purpose flag
        await OTP.create({ email, otp, purpose: 'reset' });

        // Send OTP email
        await sendForgotPasswordOTPEmail(email, otp, user.name);

        res.json({ message: 'Password reset OTP sent to your email.', email });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password - Step 2: Verify OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyForgotOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

        const otpRecord = await OTP.findOne({ email, purpose: 'reset' });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found. Please request again.' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // OTP verified — delete it and issue a short-lived reset token
        await OTP.deleteMany({ email, purpose: 'reset' });

        const resetToken = jwt.sign({ email, purpose: 'reset' }, process.env.JWT_SECRET, { expiresIn: '10m' });

        res.json({ message: 'OTP verified successfully.', resetToken });
    } catch (error) {
        console.error('Verify reset OTP error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password - Step 3: Reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Verify reset token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch {
            return res.status(400).json({ message: 'Reset link expired. Please start again.' });
        }

        if (decoded.purpose !== 'reset') {
            return res.status(400).json({ message: 'Invalid reset token.' });
        }

        const user = await User.findOne({ email: decoded.email }).select('+password');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, verifyEmail, login, forgotPassword, verifyForgotOTP, resetPassword };
