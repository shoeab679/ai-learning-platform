const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  grade_number: {
    type: Number,
    required: true,
    min: 6,
    max: 12
  },
  description: {
    type: String
  },
  icon_url: {
    type: String
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

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
