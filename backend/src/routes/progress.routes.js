const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { PythonShell } = require('python-shell');
const path = require('path');

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    // Mock progress data - in a real app, this would come from a database
    const progress = {
      user_id: req.user._id,
      subjects: [
        {
          subject: 'Mathematics',
          completion: 45, // percentage
          strengths: ['Algebra', 'Arithmetic'],
          weaknesses: ['Geometry', 'Calculus'],
          recent_activities: [
            {
              type: 'quiz',
              topic: 'Algebra',
              score: 80,
              date: new Date(Date.now() - 86400000) // yesterday
            },
            {
              type: 'content',
              topic: 'Geometry',
              completion: 60,
              date: new Date(Date.now() - 172800000) // 2 days ago
            }
          ]
        },
        {
          subject: 'Science',
          completion: 30, // percentage
          strengths: ['Biology'],
          weaknesses: ['Physics', 'Chemistry'],
          recent_activities: [
            {
              type: 'quiz',
              topic: 'Biology',
              score: 75,
              date: new Date(Date.now() - 259200000) // 3 days ago
            }
          ]
        }
      ],
      streak: 3, // days
      total_xp: 1250,
      level: 5,
      badges: [
        {
          id: 'first_quiz',
          name: 'Quiz Master',
          description: 'Completed your first quiz',
          earned_date: new Date(Date.now() - 604800000) // 7 days ago
        },
        {
          id: 'streak_3',
          name: 'On Fire',
          description: 'Maintained a 3-day streak',
          earned_date: new Date()
        }
      ]
    };
    
    // Add premium-only analytics for premium users
    if (req.user.isPremium) {
      progress.detailed_analytics = {
        time_spent: {
          total_minutes: 320,
          by_subject: {
            'Mathematics': 180,
            'Science': 140
          }
        },
        learning_style: 'Visual',
        recommended_study_time: '4:00 PM - 6:00 PM',
        performance_trend: 'improving'
      };
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Progress route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Update progress after completing content
router.post('/content-complete', auth, async (req, res) => {
  try {
    const { content_id, subject, topic, completion_percentage } = req.body;
    
    if (!content_id || !subject || !topic) {
      return res.status(400).json({ error: 'Content ID, subject, and topic are required' });
    }
    
    // In a real app, this would update a database
    // For now, just return a success response
    
    res.json({
      message: 'Progress updated successfully',
      xp_earned: 10,
      new_badges: []
    });
  } catch (error) {
    console.error('Progress update route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard/:subject', auth, async (req, res) => {
  try {
    const { subject } = req.params;
    
    // Mock leaderboard data - in a real app, this would come from a database
    const leaderboard = {
      subject,
      timeframe: 'weekly',
      current_user: {
        rank: 15,
        score: 320,
        name: req.user.name
      },
      top_users: [
        {
          rank: 1,
          name: 'Rahul S.',
          score: 950,
          grade: 10
        },
        {
          rank: 2,
          name: 'Priya M.',
          score: 840,
          grade: 9
        },
        {
          rank: 3,
          name: 'Amit K.',
          score: 780,
          grade: 10
        },
        {
          rank: 4,
          name: 'Sneha R.',
          score: 720,
          grade: 8
        },
        {
          rank: 5,
          name: 'Vikram P.',
          score: 690,
          grade: 9
        },
        {
          rank: 6,
          name: 'Neha G.',
          score: 650,
          grade: 10
        },
        {
          rank: 7,
          name: 'Arjun T.',
          score: 610,
          grade: 8
        },
        {
          rank: 8,
          name: 'Meera S.',
          score: 580,
          grade: 9
        },
        {
          rank: 9,
          name: 'Rohan D.',
          score: 550,
          grade: 10
        },
        {
          rank: 10,
          name: 'Ananya P.',
          score: 520,
          grade: 8
        }
      ]
    };
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard route error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
