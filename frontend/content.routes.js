const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Content = require('../models/content.model');
const Subject = require('../models/subject.model');
const Class = require('../models/class.model');

// Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({ is_active: true });
    res.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Server error while fetching subjects' });
  }
});

// Get all classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find({ is_active: true }).sort({ grade_number: 1 });
    res.json({ classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error while fetching classes' });
  }
});

// Get content by class and subject
router.get('/by-class-subject', auth, async (req, res) => {
  try {
    const { class_id, subject_id } = req.query;
    
    // Validate required parameters
    if (!class_id || !subject_id) {
      return res.status(400).json({ message: 'Class ID and Subject ID are required' });
    }
    
    // Build query
    const query = { 
      class_id, 
      subject_id,
      is_active: true
    };
    
    // For non-premium users, only show free content
    if (!req.user.is_premium) {
      query.is_premium = false;
    }
    
    const content = await Content.find(query)
      .sort({ sequence_order: 1 })
      .populate('subject_id', 'name icon_url color_code')
      .populate('class_id', 'name grade_number');
    
    res.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error while fetching content' });
  }
});

// Get content by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('subject_id', 'name icon_url color_code')
      .populate('class_id', 'name grade_number');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check if premium content is being accessed by non-premium user
    if (content.is_premium && !req.user.is_premium) {
      return res.status(403).json({ message: 'Premium content requires subscription' });
    }
    
    res.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error while fetching content' });
  }
});

// Get recommended content for user
router.get('/recommendations/for-me', auth, async (req, res) => {
  try {
    // Get user's class
    const userClass = req.user.class_grade;
    
    // For MVP, simple recommendation based on user's class
    // In production, this would use the adaptive learning system
    const query = { 
      is_active: true
    };
    
    // Map user class_grade to class_id (simplified for MVP)
    if (userClass && userClass >= 6 && userClass <= 12) {
      // Find class by grade number
      const classObj = await Class.findOne({ grade_number: parseInt(userClass) });
      if (classObj) {
        query.class_id = classObj._id;
      }
    }
    
    // For non-premium users, only show free content
    if (!req.user.is_premium) {
      query.is_premium = false;
    }
    
    // Get 10 recommended content items
    const recommendations = await Content.find(query)
      .sort({ created_at: -1 })
      .limit(10)
      .populate('subject_id', 'name icon_url color_code')
      .populate('class_id', 'name grade_number');
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Server error while fetching recommendations' });
  }
});

// Search content
router.get('/search/all', auth, async (req, res) => {
  try {
    const { query, class_id, subject_id } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Build search query
    const searchQuery = { 
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ],
      is_active: true
    };
    
    // Add optional filters
    if (class_id) searchQuery.class_id = class_id;
    if (subject_id) searchQuery.subject_id = subject_id;
    
    // For non-premium users, only show free content
    if (!req.user.is_premium) {
      searchQuery.is_premium = false;
    }
    
    const results = await Content.find(searchQuery)
      .sort({ sequence_order: 1 })
      .populate('subject_id', 'name icon_url color_code')
      .populate('class_id', 'name grade_number');
    
    res.json({ results });
  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({ message: 'Server error while searching content' });
  }
});

module.exports = router;
