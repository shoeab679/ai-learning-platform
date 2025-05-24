const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon_url: {
    type: String
  },
  color_code: {
    type: String,
    default: '#138808' // Default to green from Indian flag
  },
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
  }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
