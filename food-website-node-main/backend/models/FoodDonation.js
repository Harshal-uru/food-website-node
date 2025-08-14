const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donorType: {
        type: String,
        enum: ['restaurant', 'individual', 'catering', 'grocery'],
        required: true
    },
    foodItems: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        },
        description: String
    }],
    pickupAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    pickupTime: {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    specialInstructions: String,
    status: {
        type: String,
        enum: ['available', 'claimed', 'picked_up', 'delivered', 'expired'],
        default: 'available'
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO'
    },
    claimedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

foodDonationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('FoodDonation', foodDonationSchema); 