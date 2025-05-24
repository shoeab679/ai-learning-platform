const User = require('../models/user.model');

/**
 * Middleware to check if user has premium access
 * For features that should be completely blocked for non-premium users
 */
const requirePremium = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.is_premium) {
      return res.status(403).json({ 
        message: 'Premium subscription required',
        error: 'premium_required',
        upgrade_url: '/dashboard/premium'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error in premium middleware:', error);
    res.status(500).json({ message: 'Server error checking premium status' });
  }
};

/**
 * Middleware to check daily limits for free users
 * For features that have limited access for free users
 */
const checkFreemiumLimits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If user is premium, no limits apply
    if (user.is_premium) {
      req.isPremium = true;
      return next();
    }
    
    req.isPremium = false;
    
    // Check which resource is being accessed
    const resourceType = req.params.resourceType || req.query.resourceType || 'default';
    
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if user has usage_limits field, if not initialize it
    if (!user.usage_limits) {
      user.usage_limits = {};
    }
    
    // Check if user has usage for today
    if (!user.usage_limits[resourceType] || new Date(user.usage_limits[resourceType].date) < today) {
      // Reset usage for today
      user.usage_limits[resourceType] = {
        date: today,
        count: 0
      };
    }
    
    // Get limit based on resource type
    let limit = 5; // Default limit
    
    switch (resourceType) {
      case 'quiz':
        limit = 5; // 5 quizzes per day per subject
        break;
      case 'ai_tutor':
        limit = 10; // 10 AI tutor questions per day
        break;
      case 'content':
        limit = 20; // 20 content views per day
        break;
      default:
        limit = 5;
    }
    
    // Check if user has reached limit
    if (user.usage_limits[resourceType].count >= limit) {
      return res.status(403).json({ 
        message: 'Daily limit reached',
        error: 'limit_reached',
        limit: limit,
        count: user.usage_limits[resourceType].count,
        upgrade_url: '/dashboard/premium',
        limit_resets_at: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Increment usage count
    user.usage_limits[resourceType].count += 1;
    await user.save();
    
    // Add remaining count to request for potential use in controllers
    req.remainingCount = limit - user.usage_limits[resourceType].count;
    
    next();
  } catch (error) {
    console.error('Error in freemium limits middleware:', error);
    res.status(500).json({ message: 'Server error checking usage limits' });
  }
};

module.exports = {
  requirePremium,
  checkFreemiumLimits
};
