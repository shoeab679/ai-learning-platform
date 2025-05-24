const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Progress = require('../models/progress.model');
const Subject = require('../models/subject.model');
const Class = require('../models/class.model');

// Get user progress summary
router.get('/summary', auth, async (req, res) => {
  try {
    // Get overall progress stats
    const totalCompleted = await Progress.countDocuments({
      user_id: req.user._id,
      completed: true
    });
    
    const totalQuizzes = await Progress.countDocuments({
      user_id: req.user._id,
      progress_type: 'quiz_attempt'
    });
    
    const totalContent = await Progress.countDocuments({
      user_id: req.user._id,
      progress_type: 'content_view'
    });
    
    // Get average score
    const scoreData = await Progress.aggregate([
      { 
        $match: { 
          user_id: req.user._id,
          progress_type: 'quiz_attempt',
          score: { $exists: true },
          max_score: { $exists: true, $gt: 0 }
        } 
      },
      {
        $group: {
          _id: null,
          totalScore: { $sum: '$score' },
          totalMaxScore: { $sum: '$max_score' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const averageScore = scoreData.length > 0 
      ? (scoreData[0].totalScore / scoreData[0].totalMaxScore) * 100 
      : 0;
    
    // Get streak data (simplified for MVP)
    // In a real app, this would track consecutive days of activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayActivity = await Progress.findOne({
      user_id: req.user._id,
      created_at: { $gte: today }
    });
    
    const yesterdayActivity = await Progress.findOne({
      user_id: req.user._id,
      created_at: { $gte: yesterday, $lt: today }
    });
    
    let currentStreak = 0;
    if (todayActivity) {
      currentStreak = 1;
      if (yesterdayActivity) {
        // For MVP, we'll just add 1 if there was activity yesterday
        // In a real app, we'd check consecutive days going back further
        currentStreak = 2;
      }
    } else if (yesterdayActivity) {
      currentStreak = 1;
    }
    
    // Get subject-wise progress
    const subjects = await Subject.find({ is_active: true });
    const subjectProgress = [];
    
    for (const subject of subjects) {
      const subjectData = await Progress.aggregate([
        { 
          $match: { 
            user_id: req.user._id,
            subject_id: subject._id
          } 
        },
        {
          $group: {
            _id: '$subject_id',
            completedCount: { 
              $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] } 
            },
            totalCount: { $sum: 1 },
            averageScore: { 
              $avg: { 
                $cond: [
                  { $and: [
                    { $eq: ['$progress_type', 'quiz_attempt'] },
                    { $gt: ['$max_score', 0] }
                  ]},
                  { $multiply: [{ $divide: ['$score', '$max_score'] }, 100] },
                  null
                ]
              }
            }
          }
        }
      ]);
      
      subjectProgress.push({
        subject: {
          id: subject._id,
          name: subject.name,
          icon_url: subject.icon_url,
          color_code: subject.color_code
        },
        completed_count: subjectData.length > 0 ? subjectData[0].completedCount : 0,
        total_count: subjectData.length > 0 ? subjectData[0].totalCount : 0,
        completion_percentage: subjectData.length > 0 && subjectData[0].totalCount > 0
          ? (subjectData[0].completedCount / subjectData[0].totalCount) * 100
          : 0,
        average_score: subjectData.length > 0 && subjectData[0].averageScore
          ? subjectData[0].averageScore
          : 0
      });
    }
    
    // Get recent activity
    const recentActivity = await Progress.find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .limit(10)
      .populate('subject_id', 'name icon_url color_code')
      .populate('content_id', 'title')
      .populate('quiz_id', 'title');
    
    res.json({
      summary: {
        total_completed: totalCompleted,
        total_quizzes: totalQuizzes,
        total_content: totalContent,
        average_score: averageScore,
        current_streak: currentStreak
      },
      subject_progress: subjectProgress,
      recent_activity: recentActivity
    });
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    res.status(500).json({ message: 'Server error while fetching progress summary' });
  }
});

// Get progress for specific content
router.get('/content/:contentId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user_id: req.user._id,
      content_id: req.params.contentId,
      progress_type: 'content_view'
    });
    
    if (!progress) {
      return res.json({ progress: null });
    }
    
    res.json({ progress });
  } catch (error) {
    console.error('Error fetching content progress:', error);
    res.status(500).json({ message: 'Server error while fetching content progress' });
  }
});

// Update content progress
router.post('/content/:contentId', auth, async (req, res) => {
  try {
    const { completion_percentage, last_position, time_spent_seconds } = req.body;
    
    // Find existing progress or create new
    let progress = await Progress.findOne({
      user_id: req.user._id,
      content_id: req.params.contentId,
      progress_type: 'content_view'
    });
    
    if (!progress) {
      // Need to get subject and class IDs from the content
      const Content = require('../models/content.model');
      const content = await Content.findById(req.params.contentId);
      
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      progress = new Progress({
        user_id: req.user._id,
        content_id: req.params.contentId,
        subject_id: content.subject_id,
        class_id: content.class_id,
        progress_type: 'content_view',
        completion_percentage: 0,
        time_spent_seconds: 0
      });
    }
    
    // Update progress
    if (completion_percentage !== undefined) {
      progress.completion_percentage = completion_percentage;
      
      // Mark as completed if 100%
      if (completion_percentage >= 100) {
        progress.completed = true;
      }
    }
    
    if (last_position !== undefined) {
      progress.last_position = last_position;
    }
    
    if (time_spent_seconds !== undefined) {
      progress.time_spent_seconds += time_spent_seconds;
    }
    
    await progress.save();
    
    res.json({ progress });
  } catch (error) {
    console.error('Error updating content progress:', error);
    res.status(500).json({ message: 'Server error while updating content progress' });
  }
});

// Get user badges and achievements
router.get('/badges', auth, async (req, res) => {
  try {
    // For MVP, we'll generate badges based on progress data
    // In a real app, this would be a separate collection
    
    const badges = [];
    
    // Check for quiz completion badges
    const quizCount = await Progress.countDocuments({
      user_id: req.user._id,
      progress_type: 'quiz_attempt',
      completed: true
    });
    
    if (quizCount >= 1) {
      badges.push({
        id: 'first_quiz',
        name: 'Quiz Beginner',
        description: 'Completed your first quiz',
        icon_url: '/assets/badges/quiz_beginner.png',
        earned_at: new Date()
      });
    }
    
    if (quizCount >= 10) {
      badges.push({
        id: 'quiz_explorer',
        name: 'Quiz Explorer',
        description: 'Completed 10 quizzes',
        icon_url: '/assets/badges/quiz_explorer.png',
        earned_at: new Date()
      });
    }
    
    // Check for content completion badges
    const contentCount = await Progress.countDocuments({
      user_id: req.user._id,
      progress_type: 'content_view',
      completed: true
    });
    
    if (contentCount >= 1) {
      badges.push({
        id: 'first_lesson',
        name: 'Lesson Beginner',
        description: 'Completed your first lesson',
        icon_url: '/assets/badges/lesson_beginner.png',
        earned_at: new Date()
      });
    }
    
    if (contentCount >= 10) {
      badges.push({
        id: 'lesson_explorer',
        name: 'Lesson Explorer',
        description: 'Completed 10 lessons',
        icon_url: '/assets/badges/lesson_explorer.png',
        earned_at: new Date()
      });
    }
    
    // Check for perfect score badges
    const perfectScores = await Progress.countDocuments({
      user_id: req.user._id,
      progress_type: 'quiz_attempt',
      completed: true,
      score: { $gt: 0 },
      $expr: { $eq: ['$score', '$max_score'] }
    });
    
    if (perfectScores >= 1) {
      badges.push({
        id: 'first_perfect',
        name: 'Perfect Score',
        description: 'Got a perfect score on a quiz',
        icon_url: '/assets/badges/perfect_score.png',
        earned_at: new Date()
      });
    }
    
    if (perfectScores >= 5) {
      badges.push({
        id: 'perfect_master',
        name: 'Perfect Master',
        description: 'Got 5 perfect scores on quizzes',
        icon_url: '/assets/badges/perfect_master.png',
        earned_at: new Date()
      });
    }
    
    res.json({ badges });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ message: 'Server error while fetching badges' });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { subject_id, class_id, time_period } = req.query;
    
    // Build time filter
    const timeFilter = {};
    const now = new Date();
    
    if (time_period === 'daily') {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      timeFilter.created_at = { $gte: today };
    } else if (time_period === 'weekly') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);
      timeFilter.created_at = { $gte: weekStart };
    } else if (time_period === 'monthly') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      timeFilter.created_at = { $gte: monthStart };
    }
    
    // Build match query
    const matchQuery = {
      progress_type: 'quiz_attempt',
      score: { $exists: true },
      max_score: { $exists: true, $gt: 0 }
    };
    
    // Add filters if provided
    if (subject_id) matchQuery.subject_id = mongoose.Types.ObjectId(subject_id);
    if (class_id) matchQuery.class_id = mongoose.Types.ObjectId(class_id);
    if (timeFilter.created_at) matchQuery.created_at = timeFilter.created_at;
    
    // Aggregate to get leaderboard
    const leaderboard = await Progress.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$user_id',
          total_score: { $sum: '$score' },
          total_max_score: { $sum: '$max_score' },
          quiz_count: { $sum: 1 },
          average_percentage: { 
            $avg: { $multiply: [{ $divide: ['$score', '$max_score'] }, 100] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          user_id: '$_id',
          username: '$user.username',
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          profile_image_url: '$user.profile_image_url',
          total_score: 1,
          total_max_score: 1,
          quiz_count: 1,
          average_percentage: 1,
          score_percentage: { 
            $multiply: [{ $divide: ['$total_score', '$total_max_score'] }, 100] 
          }
        }
      },
      { $sort: { score_percentage: -1, quiz_count: -1 } },
      { $limit: 10 }
    ]);
    
    // Add rank and find current user's position
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
    
    // Find current user's entry
    const userEntry = rankedLeaderboard.find(entry => 
      entry.user_id.toString() === req.user._id.toString()
    );
    
    res.json({
      leaderboard: rankedLeaderboard,
      user_rank: userEntry ? userEntry.rank : null
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error while fetching leaderboard' });
  }
});

module.exports = router;
