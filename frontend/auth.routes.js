const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth.middleware');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, phone_number, password, first_name, last_name, class_grade, preferred_language } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username },
        ...(email ? [{ email }] : []),
        ...(phone_number ? [{ phone_number }] : [])
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      phone_number,
      password_hash: password,
      first_name,
      last_name,
      class_grade,
      preferred_language: preferred_language || 'english',
      auth_provider: 'local'
    });
    
    await user.save();
    
    // Generate token
    const token = user.generateAuthToken();
    
    // Update last login
    user.last_login_at = Date.now();
    await user.save();
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        class_grade: user.class_grade,
        preferred_language: user.preferred_language,
        profile_image_url: user.profile_image_url,
        is_premium: user.is_premium
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username, email, or phone
    const user = await User.findOne({
      $or: [
        { username },
        { email: username },
        { phone_number: username }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if user is using local auth
    if (user.auth_provider !== 'local') {
      return res.status(400).json({ 
        message: `Please login using ${user.auth_provider}` 
      });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = user.generateAuthToken();
    
    // Update last login
    user.last_login_at = Date.now();
    await user.save();
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        class_grade: user.class_grade,
        preferred_language: user.preferred_language,
        profile_image_url: user.profile_image_url,
        is_premium: user.is_premium
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Google OAuth login/register
router.post('/google', async (req, res) => {
  try {
    const { google_token, profile } = req.body;
    
    // In a real implementation, verify the token with Google
    // For MVP, we'll trust the token and use the profile data
    
    const { email, given_name, family_name, picture, sub } = profile;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // If user exists but used different auth method
      if (user.auth_provider !== 'google') {
        return res.status(400).json({ 
          message: `This email is already registered. Please login using ${user.auth_provider}` 
        });
      }
      
      // Update user info if needed
      user.first_name = given_name || user.first_name;
      user.last_name = family_name || user.last_name;
      user.profile_image_url = picture || user.profile_image_url;
    } else {
      // Create new user
      user = new User({
        username: email.split('@')[0] + Math.floor(Math.random() * 1000),
        email,
        first_name: given_name,
        last_name: family_name,
        profile_image_url: picture,
        auth_provider: 'google',
        auth_provider_id: sub,
        class_grade: 'other', // Will need to be updated by user
      });
    }
    
    // Update last login
    user.last_login_at = Date.now();
    await user.save();
    
    // Generate token
    const token = user.generateAuthToken();
    
    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        class_grade: user.class_grade,
        preferred_language: user.preferred_language,
        profile_image_url: user.profile_image_url,
        is_premium: user.is_premium,
        is_new_user: user.created_at === user.updated_at
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
});

// Send OTP (mock implementation for MVP)
router.post('/send-otp', async (req, res) => {
  try {
    const { phone_number } = req.body;
    
    // In a real implementation, we would send an actual OTP via SMS
    // For MVP, we'll use a fixed OTP: 123456
    
    // Generate a verification ID (in production this would be stored securely)
    const verification_id = `VERIFY-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    res.json({
      message: 'OTP sent successfully',
      verification_id,
      // In production, we would never send the OTP back in the response
      // This is just for demo purposes
      _dev_otp: '123456'
    });
  } catch (error) {
    console.error('OTP error:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
});

// Verify OTP and login/register
router.post('/verify-otp', async (req, res) => {
  try {
    const { verification_id, otp, phone_number, first_name, last_name, class_grade } = req.body;
    
    // In a real implementation, we would verify the OTP against what was sent
    // For MVP, we'll accept 123456 as valid
    if (otp !== '123456') {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // Check if user exists
    let user = await User.findOne({ phone_number });
    let is_new_user = false;
    
    if (!user) {
      // Create new user
      is_new_user = true;
      user = new User({
        username: `user${phone_number.slice(-6)}`,
        phone_number,
        first_name: first_name || 'New',
        last_name: last_name || 'User',
        auth_provider: 'local',
        class_grade: class_grade || 'other',
      });
    }
    
    // Update last login
    user.last_login_at = Date.now();
    await user.save();
    
    // Generate token
    const token = user.generateAuthToken();
    
    res.json({
      message: 'OTP verification successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        class_grade: user.class_grade,
        preferred_language: user.preferred_language,
        profile_image_url: user.profile_image_url,
        is_premium: user.is_premium,
        is_new_user
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        phone_number: req.user.phone_number,
        class_grade: req.user.class_grade,
        preferred_language: req.user.preferred_language,
        profile_image_url: req.user.profile_image_url,
        is_premium: req.user.is_premium
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

module.exports = router;
