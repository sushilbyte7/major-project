const express = require('express');
const router = express.Router();
const {
    createReview,
    getProviderReviews,
    getServiceReviews,
    getMyReviews,
    getAllReviews,
    deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public routes
router.get('/provider/:providerId', getProviderReviews);
router.get('/service/:serviceId', getServiceReviews);

// Protected routes (authenticated users)
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getMyReviews);
router.delete('/:id', protect, deleteReview);

// Admin routes
router.get('/', protect, adminOnly, getAllReviews);

module.exports = router;
