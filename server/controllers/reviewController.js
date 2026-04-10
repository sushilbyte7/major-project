const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Alert = require('../models/Alert');
const axios = require('axios');
const { sendAlertEmail } = require('../utils/emailService');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Call ML service for sentiment analysis
const analyzeSentiment = async (text) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/analyze`, {
            text: text
        });

        if (response.data.success) {
            return response.data.data;
        }

        // Fallback if ML service fails
        return {
            sentiment: 'neutral',
            score: 0,
            confidence: 0
        };
    } catch (error) {
        console.error('ML Service Error:', error.message);
        // Fallback sentiment
        return {
            sentiment: 'neutral',
            score: 0,
            confidence: 0
        };
    }
};

// @desc    Create a review for a booking
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;

        // Check if booking exists and belongs to user
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only review your own bookings' });
        }

        // Check if booking is completed
        if (booking.status !== 'Completed') {
            return res.status(400).json({ message: 'You can only review completed bookings' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this booking' });
        }

        // Analyze sentiment using ML service
        const sentimentResult = await analyzeSentiment(comment);

        // Create review
        const review = await Review.create({
            booking: bookingId,
            user: req.user._id,
            provider: booking.provider,
            service: booking.service,
            rating,
            comment,
            sentiment: sentimentResult.sentiment,
            sentimentScore: sentimentResult.score
        });

        // Update provider's average rating
        await updateProviderRating(booking.provider);

        // ─── ML Alert System ─────────────────────────────────────────
        const isLowRating = rating <= 2;
        const isNegativeSentiment = sentimentResult.sentiment === 'negative';

        if (isLowRating || isNegativeSentiment) {
            const alertType = (isLowRating && isNegativeSentiment) ? 'both'
                : isLowRating ? 'low_rating'
                : 'negative_sentiment';

            // Get provider name for email
            const provider = await Provider.findById(booking.provider);
            const providerName = provider ? provider.name : 'Unknown Provider';

            // Save alert in DB
            try {
                await Alert.create({
                    provider: booking.provider,
                    review: review._id,
                    alertType,
                    rating,
                    sentiment: sentimentResult.sentiment,
                    sentimentScore: sentimentResult.score,
                    commentPreview: comment.substring(0, 200)
                });

                // Send email to admin
                await sendAlertEmail({
                    providerName,
                    rating,
                    sentiment: sentimentResult.sentiment,
                    sentimentScore: sentimentResult.score,
                    comment: comment.substring(0, 200),
                    alertType
                });

                console.log(`🚨 Alert created & email sent for provider: ${providerName}`);
            } catch (alertErr) {
                console.error('Alert creation error (non-critical):', alertErr.message);
            }
        }
        // ─────────────────────────────────────────────────────────────

        // Populate review data
        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name')
            .populate('service', 'name')
            .populate('provider', 'name');

        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a provider
// @route   GET /api/reviews/provider/:providerId
// @access  Public
const getProviderReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ provider: req.params.providerId })
            .populate('user', 'name')
            .populate('service', 'name')
            .sort({ createdAt: -1 });

        // Calculate sentiment statistics
        const stats = {
            total: reviews.length,
            positive: reviews.filter(r => r.sentiment === 'positive').length,
            negative: reviews.filter(r => r.sentiment === 'negative').length,
            neutral: reviews.filter(r => r.sentiment === 'neutral').length,
            averageRating: reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : 0,
            averageSentimentScore: reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + r.sentimentScore, 0) / reviews.length).toFixed(2)
                : 0
        };

        res.json({
            reviews,
            stats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
const getServiceReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ service: req.params.serviceId })
            .populate('user', 'name')
            .populate('provider', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('service', 'name')
            .populate('provider', 'name')
            .populate('booking')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('service', 'name')
            .populate('provider', 'name')
            .sort({ createdAt: -1 });

        // Calculate overall statistics
        const stats = {
            total: reviews.length,
            positive: reviews.filter(r => r.sentiment === 'positive').length,
            negative: reviews.filter(r => r.sentiment === 'negative').length,
            neutral: reviews.filter(r => r.sentiment === 'neutral').length,
            averageRating: reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : 0
        };

        res.json({
            reviews,
            stats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only review owner or admin can delete
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        const providerId = review.provider;
        await review.deleteOne();

        // Update provider rating after deletion
        await updateProviderRating(providerId);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to update provider's average rating
const updateProviderRating = async (providerId) => {
    try {
        const reviews = await Review.find({ provider: providerId });

        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            await Provider.findByIdAndUpdate(providerId, {
                rating: Number(avgRating.toFixed(1))
            });
        } else {
            await Provider.findByIdAndUpdate(providerId, { rating: 0 });
        }
    } catch (error) {
        console.error('Error updating provider rating:', error);
    }
};

module.exports = {
    createReview,
    getProviderReviews,
    getServiceReviews,
    getMyReviews,
    getAllReviews,
    deleteReview
};
