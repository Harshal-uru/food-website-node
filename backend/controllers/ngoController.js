const NGO = require('../models/NGO');
const User = require('../models/User');



// Register a new NGO
const registerNGO = async (req, res) => {
    try {
        const {
            organizationName,
            registrationNumber,
            description,
            contactPerson,
            address,
            serviceAreas,
            capacity
        } = req.body;

        // Check if NGO already exists with this registration number
        const existingNGO = await NGO.findOne({ registrationNumber });
        if (existingNGO) {
            return res.status(400).json({ message: 'NGO with this registration number already exists' });
        }

        // Check if user already has an NGO profile
        const existingUserNGO = await NGO.findOne({ user: req.user.id });
        if (existingUserNGO) {
            return res.status(400).json({ message: 'User already has an NGO profile' });
        }

        const ngo = new NGO({
            user: req.user.id,
            organizationName,
            registrationNumber,
            description,
            contactPerson,
            address,
            serviceAreas,
            capacity
        });

        const savedNGO = await ngo.save();
        const populatedNGO = await NGO.findById(savedNGO._id).populate('user', 'name email');

        res.status(201).json(populatedNGO);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get NGO profile
const getNGOProfile = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id }).populate('user', 'name email');
        
        if (!ngo) {
            return res.status(404).json({ message: 'NGO profile not found' });
        }
        
        res.json(ngo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update NGO profile
const updateNGOProfile = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        
        if (!ngo) {
            return res.status(404).json({ message: 'NGO profile not found' });
        }

        // Only allow updates if NGO is not verified
        if (ngo.verificationStatus === 'verified') {
            return res.status(400).json({ message: 'Cannot update verified NGO profile' });
        }

        const updatedNGO = await NGO.findByIdAndUpdate(
            ngo._id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name email');

        res.json(updatedNGO);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all NGOs (admin function)
const getAllNGOs = async (req, res) => {
    try {
        const { verificationStatus, city, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        if (verificationStatus) query.verificationStatus = verificationStatus;
        if (city) query['address.city'] = { $regex: city, $options: 'i' };
        
        const ngos = await NGO.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await NGO.countDocuments(query);

        res.json({
            ngos,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get NGO by ID
const getNGOById = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id).populate('user', 'name email');
        
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }
        
        res.json(ngo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update NGO verification status (admin function)
const updateNGOVerificationStatus = async (req, res) => {
    try {
        const { verificationStatus } = req.body;
        
        if (!['pending', 'verified', 'rejected'].includes(verificationStatus)) {
            return res.status(400).json({ message: 'Invalid verification status' });
        }

        const ngo = await NGO.findByIdAndUpdate(
            req.params.id,
            { verificationStatus },
            { new: true, runValidators: true }
        ).populate('user', 'name email');

        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        res.json(ngo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search NGOs by location and service areas
const searchNGOs = async (req, res) => {
    try {
        const { city, serviceArea, page = 1, limit = 10 } = req.query;
        
        let query = { isActive: true, verificationStatus: 'verified' };
        
        if (city) query['address.city'] = { $regex: city, $options: 'i' };
        if (serviceArea) query.serviceAreas = { $regex: serviceArea, $options: 'i' };

        const ngos = await NGO.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await NGO.countDocuments(query);

        res.json({
            ngos,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get NGO statistics
const getNGOStats = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        
        if (!ngo) {
            return res.status(404).json({ message: 'NGO profile not found' });
        }

        // Get counts for different donation statuses
        const stats = await NGO.aggregate([
            { $match: { _id: ngo._id } },
            {
                $lookup: {
                    from: 'fooddonations',
                    localField: '_id',
                    foreignField: 'claimedBy',
                    as: 'donations'
                }
            },
            {
                $project: {
                    totalClaimed: { $size: '$donations' },
                    pendingPickups: {
                        $size: {
                            $filter: {
                                input: '$donations',
                                as: 'donation',
                                cond: { $eq: ['$$donation.status', 'claimed'] }
                            }
                        }
                    },
                    completedDeliveries: {
                        $size: {
                            $filter: {
                                input: '$donations',
                                as: 'donation',
                                cond: { $eq: ['$$donation.status', 'delivered'] }
                            }
                        }
                    }
                }
            }
        ]);

        res.json(stats[0] || { totalClaimed: 0, pendingPickups: 0, completedDeliveries: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerNGO,
    getNGOProfile,
    updateNGOProfile,
    getAllNGOs,
    getNGOById,
    updateNGOVerificationStatus,
    searchNGOs,
    getNGOStats
}; 