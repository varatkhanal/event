const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
} = require('../controllers/UserController');

// Registration
router.post('/register', registerUser);

// // Login
router.post('/login', loginUser);

// // Get user profile
router.get('/profile', getUserProfile);

// // Update user profile
router.put('/update', updateUserProfile);

// // Logout
router.get('/logout', logoutUser);

module.exports = router;
