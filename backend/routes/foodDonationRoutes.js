const express = require('express');
const {
    createFoodDonation,
    getFoodDonations,
    getFoodDonationById,
    updateFoodDonation,
    deleteFoodDonation,
    claimFoodDonation,
    updateDonationStatus,
    getUserDonations,
    getNGOClaimedDonations
} = require('../controllers/foodDonationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Food donation CRUD operations
router.post('/', createFoodDonation);
router.get('/', getFoodDonations);
router.get('/my-donations', getUserDonations);
router.get('/ngo-claimed', getNGOClaimedDonations);
router.get('/:id', getFoodDonationById);
router.put('/:id', updateFoodDonation);
router.delete('/:id', deleteFoodDonation);

// NGO operations
router.post('/:id/claim', claimFoodDonation);
router.put('/:id/status', updateDonationStatus);

module.exports = router; 