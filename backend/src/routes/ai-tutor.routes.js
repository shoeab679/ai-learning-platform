const express = require('express');
const router = express.Router();
const { auth, premiumOnly, checkQuizLimits } = require('../middleware/auth.middleware');
const { PythonShell } = require('python-shell');
const path = require('path');

// Get AI tutor response
router.post('/ask', auth, async (req, res) => {
  try {
    const { question, language, context } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Prepare data for AI tutor module
    const data = {
      question,
      language: language || 'english',
      context: context || [],
      user_id: req.user._id.toString(),
      is_premium: req.user.isPremium,
      grade: req.user.grade
    };
    
    // Call Python AI tutor module
    const scriptPath = path.join(__dirname, '../../../ai_tutor_implementation.py');
    
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
          answer: "I'm sorry, I couldn't process your question. Please try again.",
          error: "No results from AI module"
        });
      })
      .catch(err => {
        console.error('AI tutor error:', err);
        res.status(500).json({ 
          error: 'Error processing question', 
          message: err.message,
          answer: "I'm sorry, I encountered an error while processing your question. Please try again."
        });
      });
  } catch (error) {
    console.error('AI tutor route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Summarize content
router.post('/summarize', auth, async (req, res) => {
  try {
    const { text, language, level } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }
    
    // Check if advanced summarization is premium-only
    if ((level === 'advanced' || text.length > 2000) && !req.user.isPremium) {
      return res.status(403).json({ 
        error: 'Premium required', 
        message: 'Advanced summarization and long text summarization require a premium subscription',
        upgradeUrl: '/premium'
      });
    }
    
    // Prepare data for summarization module
    const data = {
      text,
      language: language || 'english',
      level: level || 'medium',
      user_id: req.user._id.toString(),
      is_premium: req.user.isPremium
    };
    
    // Call Python summarization module
    const scriptPath = path.join(__dirname, '../../../content_summarization_system.py');
    
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
          summary: "Unable to generate summary.",
          error: "No results from summarization module"
        });
      })
      .catch(err => {
        console.error('Summarization error:', err);
        res.status(500).json({ 
          error: 'Error summarizing content', 
          message: err.message
        });
      });
  } catch (error) {
    console.error('Summarization route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Speech to text conversion
router.post('/speech-to-text', auth, async (req, res) => {
  try {
    const { audio_file, language } = req.body;
    
    if (!audio_file) {
      return res.status(400).json({ error: 'Audio file data is required' });
    }
    
    // Prepare data for speech-to-text module
    const data = {
      audio_file,
      language: language || 'auto',
      user_id: req.user._id.toString()
    };
    
    // Call Python speech-to-text module
    const scriptPath = path.join(__dirname, '../../../speech_to_text_integration.py');
    
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
          text: "",
          error: "No results from speech-to-text module"
        });
      })
      .catch(err => {
        console.error('Speech-to-text error:', err);
        res.status(500).json({ 
          error: 'Error processing speech', 
          message: err.message
        });
      });
  } catch (error) {
    console.error('Speech-to-text route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
