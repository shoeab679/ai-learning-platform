const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
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
  content_type: {
    type: String,
    enum: ['text', 'video', 'interactive'],
    required: true
  },
  content_url: {
    type: String
  },
  content_text: {
    type: String
  },
  thumbnail_url: {
    type: String
  },
  duration_minutes: {
    type: Number
  },
  difficulty_level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  is_premium: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  sequence_order: {
    type: Number,
    default: 0
  },
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
contentSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
