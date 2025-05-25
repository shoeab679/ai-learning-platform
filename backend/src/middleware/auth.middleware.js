const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware to authenticate user
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Add user to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Middleware to check if user is premium
const premiumOnly = (req, res, next) => {
  if (!req.user.isPremium) {
    return res.status(403).json({ error: 'Premium subscription required for this feature' });
  }
  next();
};

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Middleware to check daily quiz limits for free users
const checkQuizLimits = async (req, res, next) => {
  try {
    // Premium users have no limits
    if (req.user.isPremium) {
      return next();
    }
    
    const user = req.user;
    const subject = req.params.subject || req.body.subject;
    
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }
    
    // Reset daily attempts if it's a new day
    user.resetDailyQuizAttempts();
    
    // Check if user has reached daily limit for this subject
    const dailyAttempts = user.dailyQuizAttempts.get(subject) || 0;
    
    if (dailyAttempts >= 5) {
      return res.status(403).json({ 
        error: 'Daily quiz limit reached', 
        message: 'Free users can only take 5 quizzes per subject per day. Upgrade to premium for unlimited access.',
        upgradeUrl: '/premium'
      });
    }
    
    // Increment attempt count
    user.dailyQuizAttempts.set(subject, dailyAttempts + 1);
    user.lastQuizDate = new Date();
    await user.save();
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

module.exports = { auth, premiumOnly, adminOnly, checkQuizLimits };
