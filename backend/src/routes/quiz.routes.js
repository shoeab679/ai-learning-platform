const express = require('express');
const router = express.Router();
const { auth, premiumOnly, checkQuizLimits } = require('../middleware/auth.middleware');
const { PythonShell } = require('python-shell');
const path = require('path');

// Get quiz for a subject and topic
router.get('/:subject/:topic', auth, checkQuizLimits, async (req, res) => {
  try {
    const { subject, topic } = req.params;
    const { difficulty } = req.query;
    
    // Prepare data for quiz difficulty adjustment module
    const data = {
      user_id: req.user._id.toString(),
      subject,
      topic,
      difficulty: difficulty || 'auto',
      is_premium: req.user.isPremium,
      count: req.user.isPremium ? 10 : 5 // Premium users get more questions
    };
    
    // Call Python quiz difficulty adjustment module
    const scriptPath = path.join(__dirname, '../../../quiz_difficulty_adjustment.py');
    
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
        res.json({ 
          error: "No quiz generated",
          questions: []
        });
      })
      .catch(err => {
        console.error('Quiz generation error:', err);
        res.status(500).json({ 
          error: 'Error generating quiz', 
          message: err.message
        });
      });
  } catch (error) {
    console.error('Quiz route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Submit quiz answers
router.post('/submit', auth, async (req, res) => {
  try {
    const { quiz_id, subject, topic, answers } = req.body;
    
    if (!quiz_id || !subject || !topic || !answers) {
      return res.status(400).json({ error: 'Quiz ID, subject, topic, and answers are required' });
    }
    
    // Prepare data for quiz analysis
    const data = {
      user_id: req.user._id.toString(),
      quiz_id,
      subject,
      topic,
      answers,
      is_premium: req.user.isPremium
    };
    
    // Call Python quiz difficulty adjustment module for analysis
    const scriptPath = path.join(__dirname, '../../../quiz_difficulty_adjustment.py');
    
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: path.dirname(scriptPath),
      args: [JSON.stringify(data), 'analyze']
    };
    
    PythonShell.run(path.basename(scriptPath), options)
      .then(results => {
        if (results && results.length > 0) {
          return res.json(results[0]);
        }
        res.json({ 
          error: "No analysis generated",
          score: 0,
          feedback: "Unable to analyze quiz results."
        });
      })
      .catch(err => {
        console.error('Quiz analysis error:', err);
        res.status(500).json({ 
          error: 'Error analyzing quiz', 
          message: err.message
        });
      });
  } catch (error) {
    console.error('Quiz submission route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get daily quiz limits status
router.get('/limits/:subject', auth, async (req, res) => {
  try {
    const { subject } = req.params;
    
    // Premium users have no limits
    if (req.user.isPremium) {
      return res.json({
        subject,
        unlimited: true,
        message: "Premium users have unlimited quiz access",
        remaining: "unlimited"
      });
    }
    
    // Reset daily attempts if it's a new day
    req.user.resetDailyQuizAttempts();
    
    // Get remaining attempts
    const dailyAttempts = req.user.dailyQuizAttempts.get(subject) || 0;
    const remaining = Math.max(0, 5 - dailyAttempts);
    
    res.json({
      subject,
      unlimited: false,
      remaining,
      total: 5,
      used: dailyAttempts,
      upgradeUrl: '/premium'
    });
  } catch (error) {
    console.error('Quiz limits route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
