const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    alertType: {
        type: String,
        enum: ['low_rating', 'negative_sentiment', 'both'],
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    sentiment: {
        type: String,
        required: true
    },
    sentimentScore: {
        type: Number,
        default: 0
    },
    commentPreview: {
        type: String,
        maxlength: 200
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
