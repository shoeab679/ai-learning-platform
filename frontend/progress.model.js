const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
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
  progress_type: {
    type: String,
    enum: ['content_view', 'quiz_attempt', 'practice'],
    required: true
  },
  completion_percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  score: {
    type: Number,
    min: 0
  },
  max_score: {
    type: Number,
    min: 0
  },
  time_spent_seconds: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  last_position: {
    type: String
  },
  quiz_responses: [{
    question_index: Number,
    selected_option: String,
    is_correct: Boolean,
    time_taken_seconds: Number
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
progressSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
