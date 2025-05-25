const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, grade } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password,
      grade
    });
    
    await user.save();
    
    // Generate token
    const token = user.generateAuthToken();
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = user.generateAuthToken();
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, grade } = req.body;
    
    // Find and update user
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (name) user.name = name;
    if (grade) user.grade = grade;
    
    await user.save();
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Upgrade to premium (mock)
router.post('/upgrade-premium', auth, async (req, res) => {
  try {
    // In a real app, this would handle payment processing
    // For now, we'll just update the user status
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isPremium = true;
    await user.save();
    
    // Generate new token with updated premium status
    const token = user.generateAuthToken();
    
    res.json({
      message: 'Upgraded to premium successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Premium upgrade error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
