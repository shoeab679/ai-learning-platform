const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');

/**
 * @route   GET /api/premium/status
 * @desc    Get premium status for current user
 * @access  Private
 */
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('is_premium premium_expires_at premium_plan');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if premium has expired
    if (user.is_premium && user.premium_expires_at && new Date(user.premium_expires_at) < new Date()) {
      user.is_premium = false;
      user.premium_plan = null;
      await user.save();
    }
    
    res.json({
      is_premium: user.is_premium,
      premium_plan: user.premium_plan,
      premium_expires_at: user.premium_expires_at
    });
  } catch (error) {
    console.error('Error getting premium status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/premium/upgrade
 * @desc    Upgrade user to premium (demo implementation)
 * @access  Private
 */
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!plan || !['monthly', 'annual'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Set premium status
    user.is_premium = true;
    user.premium_plan = plan;
    
    // Set expiration date based on plan
    const now = new Date();
    if (plan === 'monthly') {
      user.premium_expires_at = new Date(now.setMonth(now.getMonth() + 1));
    } else {
      user.premium_expires_at = new Date(now.setFullYear(now.getFullYear() + 1));
    }
    
    await user.save();
    
    res.json({
      message: 'Successfully upgraded to premium',
      is_premium: true,
      premium_plan: plan,
      premium_expires_at: user.premium_expires_at
    });
  } catch (error) {
    console.error('Error upgrading to premium:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/premium/cancel
 * @desc    Cancel premium subscription (demo implementation)
 * @access  Private
 */
router.post('/cancel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // User will remain premium until expiration date
    res.json({
      message: 'Premium subscription will be canceled at the end of the billing period',
      is_premium: user.is_premium,
      premium_expires_at: user.premium_expires_at
    });
  } catch (error) {
    console.error('Error canceling premium:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/premium/usage-limits
 * @desc    Get current usage limits for free user
 * @access  Private
 */
router.get('/usage-limits', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If user is premium, no limits apply
    if (user.is_premium) {
      return res.json({
        is_premium: true,
        message: 'No usage limits for premium users'
      });
    }
    
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Initialize usage limits if not present
    if (!user.usage_limits) {
      user.usage_limits = {};
    }
    
    // Define limits for different resource types
    const limits = {
      quiz: 5,
      ai_tutor: 10,
      content: 20
    };
    
    // Calculate remaining limits for each resource type
    const usageLimits = {};
    
    for (const [resourceType, limit] of Object.entries(limits)) {
      if (!user.usage_limits[resourceType] || new Date(user.usage_limits[resourceType].date) < today) {
        usageLimits[resourceType] = {
          limit,
          used: 0,
          remaining: limit,
          resets_at: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        };
      } else {
        usageLimits[resourceType] = {
          limit,
          used: user.usage_limits[resourceType].count,
          remaining: Math.max(0, limit - user.usage_limits[resourceType].count),
          resets_at: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        };
      }
    }
    
    res.json({
      is_premium: false,
      usage_limits: usageLimits
    });
  } catch (error) {
    console.error('Error getting usage limits:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
