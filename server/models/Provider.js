const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a provider name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email'],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
            trim: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: [true, 'Please assign a service'],
        },
        experience: {
            type: Number,
            default: 0,
            min: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Provider', providerSchema);
