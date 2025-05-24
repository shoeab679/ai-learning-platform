const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  difficulty_level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  time_limit_minutes: {
    type: Number,
    default: 10
  },
  is_adaptive: {
    type: Boolean,
    default: true
  },
  is_premium: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  questions: [{
    question_text: {
      type: String,
      required: true
    },
    question_type: {
      type: String,
      enum: ['multiple_choice', 'true_false', 'fill_blank', 'match'],
      default: 'multiple_choice'
    },
    options: [{
      option_text: String,
      is_correct: Boolean
    }],
    correct_answer: String,
    explanation: String,
    difficulty_level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    points: {
      type: Number,
      default: 1
    }
  }],
  tags: [{
    type: String
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update timestamp
quizSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
