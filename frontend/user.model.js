const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  phone_number: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: function() {
      return this.auth_provider === 'local';
    }
  },
  auth_provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  auth_provider_id: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['student', 'parent', 'teacher', 'admin'],
    default: 'student'
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  profile_image_url: {
    type: String,
    default: '/assets/default-avatar.png'
  },
  class_grade: {
    type: String,
    enum: ['6', '7', '8', '9', '10', '11', '12', 'college', 'other'],
    required: true
  },
  date_of_birth: {
    type: Date
  },
  preferred_language: {
    type: String,
    enum: ['english', 'hindi'],
    default: 'english'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  last_login_at: {
    type: Date
  },
  is_premium: {
    type: Boolean,
    default: false
  },
  subscription_end_date: {
    type: Date
  }
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (this.isModified('password_hash') && this.auth_provider === 'local') {
    this.password_hash = await bcrypt.hash(this.password_hash, 10);
  }
  this.updated_at = Date.now();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

// Method to generate auth token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      role: this.role,
      is_premium: this.is_premium
    },
    process.env.JWT_SECRET || 'edusaarthi-secret-key',
    { expiresIn: '24h' }
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
