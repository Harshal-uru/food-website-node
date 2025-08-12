const FoodDonation = require('../models/FoodDonation');
const NGO = require('../models/NGO');

// Create a new food donation
const createFoodDonation = async (req, res) => {
    try {
        const { donorType, foodItems, pickupAddress, pickupTime, specialInstructions } = req.body;
        
        const foodDonation = new FoodDonation({
            donor: req.user.id,
            donorType,
            foodItems,
            pickupAddress,
            pickupTime,
            specialInstructions
        });

        const savedDonation = await foodDonation.save();
        const populatedDonation = await FoodDonation.findById(savedDonation._id)
            .populate('donor', 'name email')
            .populate('claimedBy', 'organizationName');

        res.status(201).json(populatedDonation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all food donations (with filters)
const getFoodDonations = async (req, res) => {
    try {
        const { status, donorType, city, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        if (status) query.status = status;
        if (donorType) query.donorType = donorType;
        if (city) query['pickupAddress.city'] = { $regex: city, $options: 'i' };
        
        // Only show available donations to non-donors
        if (!req.query.showAll) {
            query.status = { $in: ['available', 'claimed'] };
        }

        const donations = await FoodDonation.find(query)
            .populate('donor', 'name email')
            .populate('claimedBy', 'organizationName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await FoodDonation.countDocuments(query);

        res.json({
            donations,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get food donation by ID
const getFoodDonationById = async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id)
            .populate('donor', 'name email')
            .populate('claimedBy', 'organizationName');
        
        if (!donation) {
            return res.status(404).json({ message: 'Food donation not found' });
        }
        
        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update food donation
const updateFoodDonation = async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ message: 'Food donation not found' });
        }
        
        // Check if user is the donor
        if (donation.donor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this donation' });
        }
        
        // Only allow updates if donation is still available
        if (donation.status !== 'available') {
            return res.status(400).json({ message: 'Cannot update claimed or picked up donation' });
        }
        
        const updatedDonation = await FoodDonation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('donor', 'name email')
         .populate('claimedBy', 'organizationName');
        
        res.json(updatedDonation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete food donation
const deleteFoodDonation = async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ message: 'Food donation not found' });
        }
        
        // Check if user is the donor
        if (donation.donor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this donation' });
        }
        
        // Only allow deletion if donation is still available
        if (donation.status !== 'available') {
            return res.status(400).json({ message: 'Cannot delete claimed or picked up donation' });
        }
        
        await FoodDonation.findByIdAndDelete(req.params.id);
        res.json({ message: 'Food donation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Claim a food donation (NGO only)
const claimFoodDonation = async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ message: 'Food donation not found' });
        }
        
        if (donation.status !== 'available') {
            return res.status(400).json({ message: 'Donation is not available for claiming' });
        }
        
        // Check if user is an NGO
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(403).json({ message: 'Only NGOs can claim donations' });
        }
        
        if (ngo.verificationStatus !== 'verified') {
            return res.status(403).json({ message: 'NGO must be verified to claim donations' });
        }
        
        donation.status = 'claimed';
        donation.claimedBy = ngo._id;
        donation.claimedAt = new Date();
        
        const updatedDonation = await donation.save();
        const populatedDonation = await FoodDonation.findById(updatedDonation._id)
            .populate('donor', 'name email')
            .populate('claimedBy', 'organizationName');
        
        res.json(populatedDonation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update donation status (for donors and NGOs)
const updateDonationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const donation = await FoodDonation.findById(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ message: 'Food donation not found' });
        }
        
        // Check if user is the donor or the claiming NGO
        if (donation.donor.toString() !== req.user.id && 
            (!donation.claimedBy || donation.claimedBy.toString() !== req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to update this donation' });
        }
        
        donation.status = status;
        const updatedDonation = await donation.save();
        const populatedDonation = await FoodDonation.findById(updatedDonation._id)
            .populate('donor', 'name email')
            .populate('claimedBy', 'organizationName');
        
        res.json(populatedDonation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's donations
const getUserDonations = async (req, res) => {
    try {
        const donations = await FoodDonation.find({ donor: req.user.id })
            .populate('claimedBy', 'organizationName')
            .sort({ createdAt: -1 });
        
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get NGO's claimed donations
const getNGOClaimedDonations = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(403).json({ message: 'User is not an NGO' });
        }
        
        const donations = await FoodDonation.find({ claimedBy: ngo._id })
            .populate('donor', 'name email')
            .sort({ claimedAt: -1 });
        
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFoodDonation,
    getFoodDonations,
    getFoodDonationById,
    updateFoodDonation,
    deleteFoodDonation,
    claimFoodDonation,
    updateDonationStatus,
    getUserDonations,
    getNGOClaimedDonations
}; 