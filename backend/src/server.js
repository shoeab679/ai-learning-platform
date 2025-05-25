require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { PythonShell } = require('python-shell');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const contentRoutes = require('./routes/content.routes');
const quizRoutes = require('./routes/quiz.routes');
const progressRoutes = require('./routes/progress.routes');
const aiTutorRoutes = require('./routes/ai-tutor.routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EduSaarthi API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai-tutor', aiTutorRoutes);

// Python AI module integration endpoint
app.post('/api/ai/process', (req, res) => {
  const { module, data } = req.body;
  
  if (!module || !data) {
    return res.status(400).json({ error: 'Module name and data are required' });
  }
  
  let scriptPath;
  switch (module) {
    case 'adaptive_learning':
      scriptPath = path.join(__dirname, '../../adaptive_learning_system.py');
      break;
    case 'ai_tutor':
      scriptPath = path.join(__dirname, '../../ai_tutor_implementation.py');
      break;
    case 'quiz_difficulty':
      scriptPath = path.join(__dirname, '../../quiz_difficulty_adjustment.py');
      break;
    case 'speech_to_text':
      scriptPath = path.join(__dirname, '../../speech_to_text_integration.py');
      break;
    case 'content_summarization':
      scriptPath = path.join(__dirname, '../../content_summarization_system.py');
      break;
    default:
      return res.status(400).json({ error: 'Invalid module name' });
  }
  
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
      res.json({ message: 'Process completed but no results returned' });
    })
    .catch(err => {
      console.error('Python script error:', err);
      res.status(500).json({ error: 'Error processing AI module', details: err.message });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
