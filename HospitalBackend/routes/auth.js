const express = require('express');
const router = express.Router();


// 1. Make sure these names match the "exports.NAME" in your controller exactly!
const { 
    register, 
    login, 
    getMe, 
    updateDetails 
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// 2. These lines will only work if getMe and updateDetails are functions
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;