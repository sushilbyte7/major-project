const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/emailService');

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

module.exports = { register, verifyEmail, login };
