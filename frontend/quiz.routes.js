const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Quiz = require('../models/quiz.model');
const Progress = require('../models/progress.model');
const Subject = require('../models/subject.model');
const Class = require('../models/class.model');

// Get available quizzes by class and subject
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
    
    // For non-premium users, only show free quizzes
    if (!req.user.is_premium) {
      query.is_premium = false;
    }
    
    const quizzes = await Quiz.find(query)
      .select('-questions.options.is_correct -questions.correct_answer') // Don't send answers
      .populate('subject_id', 'name icon_url color_code')
      .populate('class_id', 'name grade_number')
      .populate('content_id', 'title');
    
    res.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error while fetching quizzes' });
  }
});

// Get daily free quizzes for user
router.get('/daily-free', auth, async (req, res) => {
  try {
    // Get user's class
    const userClass = req.user.class_grade;
    
    // Find class by grade number
    let classObj;
    if (userClass && userClass >= 6 && userClass <= 12) {
      classObj = await Class.findOne({ grade_number: parseInt(userClass) });
    }
    
    if (!classObj) {
      return res.status(400).json({ message: 'Valid class grade is required' });
    }
    
    // Get all subjects
    const subjects = await Subject.find({ is_active: true });
    
    // For each subject, check if user has attempted 5 questions today
    const dailyQuizzes = [];
    
    for (const subject of subjects) {
      // Count today's quiz attempts for this subject
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const attemptCount = await Progress.countDocuments({
        user_id: req.user._id,
        subject_id: subject._id,
        progress_type: 'quiz_attempt',
        created_at: { $gte: today }
      });
      
      // If less than 5 attempts, find an available quiz
      if (attemptCount < 5) {
        const availableQuiz = await Quiz.findOne({
          subject_id: subject._id,
          class_id: classObj._id,
          is_premium: false,
          is_active: true
        })
        .select('-questions.options.is_correct -questions.correct_answer')
        .populate('subject_id', 'name icon_url color_code');
        
        if (availableQuiz) {
          dailyQuizzes.push({
            quiz: availableQuiz,
            attempts_remaining: 5 - attemptCount
          });
        }
      }
    }
    
    res.json({ daily_quizzes: dailyQuizzes });
  } catch (error) {
    console.error('Error fetching daily quizzes:', error);
    res.status(500).json({ message: 'Server error while fetching daily quizzes' });
  }
});

// Get quiz by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.options.is_correct -questions.correct_answer') // Don't send answers
      .populate('subject_id', 'name icon_url color_code')
      .populate('class_id', 'name grade_number')
      .populate('content_id', 'title');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if premium quiz is being accessed by non-premium user
    if (quiz.is_premium && !req.user.is_premium) {
      return res.status(403).json({ message: 'Premium quiz requires subscription' });
    }
    
    // For free users, check daily limit
    if (!req.user.is_premium) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const attemptCount = await Progress.countDocuments({
        user_id: req.user._id,
        subject_id: quiz.subject_id,
        progress_type: 'quiz_attempt',
        created_at: { $gte: today }
      });
      
      if (attemptCount >= 5) {
        return res.status(403).json({ 
          message: 'Daily quiz limit reached for this subject',
          limit_reached: true
        });
      }
    }
    
    res.json({ quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Server error while fetching quiz' });
  }
});

// Submit quiz answers
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Valid answers array is required' });
    }
    
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if premium quiz is being accessed by non-premium user
    if (quiz.is_premium && !req.user.is_premium) {
      return res.status(403).json({ message: 'Premium quiz requires subscription' });
    }
    
    // For free users, check daily limit
    if (!req.user.is_premium) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const attemptCount = await Progress.countDocuments({
        user_id: req.user._id,
        subject_id: quiz.subject_id,
        progress_type: 'quiz_attempt',
        created_at: { $gte: today }
      });
      
      if (attemptCount >= 5) {
        return res.status(403).json({ 
          message: 'Daily quiz limit reached for this subject',
          limit_reached: true
        });
      }
    }
    
    // Process answers and calculate score
    let score = 0;
    const maxScore = quiz.questions.length;
    const quizResponses = [];
    
    answers.forEach((answer, index) => {
      if (index >= quiz.questions.length) return;
      
      const question = quiz.questions[index];
      let isCorrect = false;
      
      if (question.question_type === 'multiple_choice') {
        // Find the correct option
        const correctOption = question.options.findIndex(opt => opt.is_correct);
        isCorrect = answer === correctOption;
      } else if (question.question_type === 'true_false') {
        isCorrect = answer === question.correct_answer;
      } else if (question.question_type === 'fill_blank') {
        isCorrect = answer.toLowerCase() === question.correct_answer.toLowerCase();
      }
      
      if (isCorrect) {
        score += question.points || 1;
      }
      
      quizResponses.push({
        question_index: index,
        selected_option: answer,
        is_correct: isCorrect,
        time_taken_seconds: 0 // In a real app, this would be tracked
      });
    });
    
    // Create progress record
    const progress = new Progress({
      user_id: req.user._id,
      quiz_id: quiz._id,
      subject_id: quiz.subject_id,
      class_id: quiz.class_id,
      progress_type: 'quiz_attempt',
      score,
      max_score: maxScore,
      completion_percentage: (score / maxScore) * 100,
      completed: true,
      quiz_responses: quizResponses
    });
    
    await progress.save();
    
    // Return results with correct answers
    const results = {
      score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
      passing_score: 70,
      passed: (score / maxScore) * 100 >= 70,
      questions: quiz.questions.map((q, i) => {
        const userAnswer = i < answers.length ? answers[i] : null;
        let correctAnswer;
        
        if (q.question_type === 'multiple_choice') {
          correctAnswer = q.options.findIndex(opt => opt.is_correct);
        } else {
          correctAnswer = q.correct_answer;
        }
        
        return {
          question_text: q.question_text,
          user_answer: userAnswer,
          correct_answer: correctAnswer,
          is_correct: quizResponses[i]?.is_correct || false,
          explanation: q.explanation
        };
      })
    };
    
    res.json({ results, progress_id: progress._id });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error while submitting quiz' });
  }
});

// Get adaptive quiz question (for premium or within daily limit)
router.get('/adaptive/next-question', auth, async (req, res) => {
  try {
    const { subject_id, difficulty_level } = req.query;
    
    if (!subject_id) {
      return res.status(400).json({ message: 'Subject ID is required' });
    }
    
    // Get user's class
    const userClass = req.user.class_grade;
    
    // Find class by grade number
    let classObj;
    if (userClass && userClass >= 6 && userClass <= 12) {
      classObj = await Class.findOne({ grade_number: parseInt(userClass) });
    }
    
    if (!classObj) {
      return res.status(400).json({ message: 'Valid class grade is required' });
    }
    
    // For free users, check daily limit
    if (!req.user.is_premium) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const attemptCount = await Progress.countDocuments({
        user_id: req.user._id,
        subject_id,
        progress_type: 'quiz_attempt',
        created_at: { $gte: today }
      });
      
      if (attemptCount >= 5) {
        return res.status(403).json({ 
          message: 'Daily quiz limit reached for this subject',
          limit_reached: true
        });
      }
    }
    
    // Find a quiz with the appropriate difficulty
    const query = {
      subject_id,
      class_id: classObj._id,
      is_active: true
    };
    
    // Apply difficulty filter if provided
    if (difficulty_level) {
      query.difficulty_level = difficulty_level;
    }
    
    // For non-premium users, only show free quizzes
    if (!req.user.is_premium) {
      query.is_premium = false;
    }
    
    // Find a random quiz
    const quizzes = await Quiz.find(query);
    
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: 'No suitable quizzes found' });
    }
    
    const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    
    // Select a random question from the quiz
    const randomQuestionIndex = Math.floor(Math.random() * randomQuiz.questions.length);
    const question = randomQuiz.questions[randomQuestionIndex];
    
    // Remove correct answer information
    const sanitizedQuestion = {
      quiz_id: randomQuiz._id,
      question_index: randomQuestionIndex,
      question_text: question.question_text,
      question_type: question.question_type,
      options: question.options.map(opt => ({ option_text: opt.option_text })),
      difficulty_level: question.difficulty_level,
      points: question.points
    };
    
    res.json({ question: sanitizedQuestion });
  } catch (error) {
    console.error('Error fetching adaptive question:', error);
    res.status(500).json({ message: 'Server error while fetching adaptive question' });
  }
});

module.exports = router;
