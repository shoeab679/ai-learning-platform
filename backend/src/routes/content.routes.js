const express = require('express');
const router = express.Router();
const { auth, premiumOnly } = require('../middleware/auth.middleware');
const { PythonShell } = require('python-shell');
const path = require('path');

// Get content for a subject and class
router.get('/:subject/:class', auth, async (req, res) => {
  try {
    const { subject, class: classLevel } = req.params;
    
    // Mock content data - in a real app, this would come from a database
    const content = {
      subject,
      class: classLevel,
      topics: [
        {
          id: `${subject}-${classLevel}-1`,
          title: `Introduction to ${subject} for Class ${classLevel}`,
          type: 'text',
          content: `This is an introduction to ${subject} for students in Class ${classLevel}.`,
          isPremium: false
        },
        {
          id: `${subject}-${classLevel}-2`,
          title: `Advanced ${subject} Concepts for Class ${classLevel}`,
          type: 'text',
          content: `These are advanced concepts in ${subject} for Class ${classLevel}.`,
          isPremium: true
        },
        {
          id: `${subject}-${classLevel}-3`,
          title: `${subject} Practice Problems for Class ${classLevel}`,
          type: 'practice',
          content: `Practice problems for ${subject}, Class ${classLevel}.`,
          isPremium: false
        }
      ]
    };
    
    // Filter premium content for free users
    if (!req.user.isPremium) {
      content.topics = content.topics.filter(topic => !topic.isPremium);
      content.premiumContentAvailable = true;
      content.upgradeUrl = '/premium';
    }
    
    res.json(content);
  } catch (error) {
    console.error('Content route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get personalized content recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    // Prepare data for adaptive learning module
    const data = {
      user_id: req.user._id.toString(),
      grade: req.user.grade,
      is_premium: req.user.isPremium
    };
    
    // Call Python adaptive learning module
    const scriptPath = path.join(__dirname, '../../../adaptive_learning_system.py');
    
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: path.dirname(scriptPath),
      args: [JSON.stringify(data)]
    };
    
    PythonShell.run(path.basename(scriptPath), options)
      .then(results => {
        if (results && results.length > 0) {
          return res.json(results[0]);
        }
        
        // Fallback recommendations if AI module fails
        res.json({ 
          recommendations: [
            {
              id: 'math-algebra',
              title: 'Algebra Basics',
              subject: 'Mathematics',
              topic: 'Algebra',
              difficulty: 'medium',
              relevance: 'high'
            },
            {
              id: 'science-physics',
              title: 'Introduction to Physics',
              subject: 'Science',
              topic: 'Physics',
              difficulty: 'easy',
              relevance: 'medium'
            }
          ]
        });
      })
      .catch(err => {
        console.error('Recommendations error:', err);
        res.status(500).json({ 
          error: 'Error generating recommendations', 
          message: err.message
        });
      });
  } catch (error) {
    console.error('Recommendations route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get premium content (requires premium subscription)
router.get('/premium/:id', auth, premiumOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock premium content - in a real app, this would come from a database
    const content = {
      id,
      title: `Premium Content: ${id}`,
      type: 'text',
      content: `This is premium content with ID ${id}.`,
      additionalResources: [
        {
          title: 'Downloadable PDF',
          url: `/resources/${id}.pdf`,
          type: 'pdf'
        },
        {
          title: 'Practice Test',
          url: `/tests/${id}`,
          type: 'test'
        }
      ]
    };
    
    res.json(content);
  } catch (error) {
    console.error('Premium content route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
