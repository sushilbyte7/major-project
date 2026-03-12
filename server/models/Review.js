const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Provider',
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Please provide a review comment'],
            trim: true,
            minlength: [10, 'Review must be at least 10 characters'],
            maxlength: [500, 'Review cannot exceed 500 characters'],
        },
        sentiment: {
            type: String,
            enum: ['positive', 'negative', 'neutral'],
            default: 'neutral',
        },
        sentimentScore: {
            type: Number,
            default: 0,
            min: -1,
            max: 1,
        },
    },
    { timestamps: true }
);

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
