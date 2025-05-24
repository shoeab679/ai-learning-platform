const mongoose = require('mongoose');

const aiTutorSessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session_id: {
    type: String,
    required: true,
    unique: true
  },
  language: {
    type: String,
    enum: ['english', 'hindi'],
    default: 'english'
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    content_type: {
      type: String,
      enum: ['text', 'audio', 'image'],
      default: 'text'
    },
    media_url: {
      type: String
    }
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  last_interaction_at: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update timestamp
aiTutorSessionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const AiTutorSession = mongoose.model('AiTutorSession', aiTutorSessionSchema);

module.exports = AiTutorSession;
