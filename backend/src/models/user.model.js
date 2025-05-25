const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'parent', 'teacher', 'admin'],
    default: 'student'
  },
  grade: {
    type: Number,
    min: 6,
    max: 12
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  dailyQuizAttempts: {
    type: Map,
    of: Number,
    default: {}
  },
  lastQuizDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role, isPremium: this.isPremium },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Method to reset daily quiz attempts
userSchema.methods.resetDailyQuizAttempts = function() {
  const today = new Date().toISOString().split('T')[0];
  const lastQuizDate = this.lastQuizDate ? this.lastQuizDate.toISOString().split('T')[0] : null;
  
  if (lastQuizDate !== today) {
    this.dailyQuizAttempts = {};
    this.lastQuizDate = new Date();
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
