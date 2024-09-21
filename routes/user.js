// routes/user.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Use bcryptjs instead of bcrypt
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(req.user.id);

    // Update user details
    user.username = username || user.username;
    user.email = email || user.email;

    // If password is provided, hash it and update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
