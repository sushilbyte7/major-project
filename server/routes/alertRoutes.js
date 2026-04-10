const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// @desc    Get all alerts (Admin only)
// @route   GET /api/alerts
// @access  Admin
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const alerts = await Alert.find()
            .populate('provider', 'name')
            .populate('review', 'comment rating')
            .sort({ createdAt: -1 });

        const unreadCount = alerts.filter(a => !a.isRead).length;

        res.json({ alerts, unreadCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get unread alert count only (for badge)
// @route   GET /api/alerts/unread-count
// @access  Admin
router.get('/unread-count', protect, adminOnly, async (req, res) => {
    try {
        const count = await Alert.countDocuments({ isRead: false });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Mark a single alert as read
// @route   PUT /api/alerts/:id/read
// @access  Admin
router.put('/:id/read', protect, adminOnly, async (req, res) => {
    try {
        await Alert.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Alert marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Mark all alerts as read
// @route   PUT /api/alerts/read-all
// @access  Admin
router.put('/read-all', protect, adminOnly, async (req, res) => {
    try {
        await Alert.updateMany({ isRead: false }, { isRead: true });
        res.json({ message: 'All alerts marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
