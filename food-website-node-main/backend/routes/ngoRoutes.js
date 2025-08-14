const express = require('express');
const {
    registerNGO,
    getNGOProfile,
    updateNGOProfile,
    getAllNGOs,
    getNGOById,
    updateNGOVerificationStatus,
    searchNGOs,
    getNGOStats
} = require('../controllers/ngoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.get('/search', searchNGOs);
router.get('/:id', getNGOById);

// Protected routes (authentication required)
router.use(protect);

// NGO profile management
router.post('/register', registerNGO);
router.get('/profile', getNGOProfile);
router.put('/profile', updateNGOProfile);
router.get('/stats', getNGOStats);

// Admin routes (these would typically have additional admin middleware)
router.get('/', getAllNGOs);
router.put('/:id/verify', updateNGOVerificationStatus);

module.exports = router; 