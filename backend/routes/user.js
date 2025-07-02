const express = require('express');
const { User } = require('../model/user');
const { signToken } = require('../utils/jwt');
const auth = require('../MIddleware/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({ name, email, password: hashedPassword });
    let accessToken = signToken({ name: user.name, email: user.email, id: user._id });
    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      accessToken,
      user: { name: user.name, email: user.email, id: user._id }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    let accessToken = signToken({ name: user.name, email: user.email, id: user._id });
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: { name: user.name, email: user.email, id: user._id }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get Logged-In User
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Logout (stateless)
router.post('/logout', (req, res) => {
  // For JWT, logout is handled client-side by deleting the token
  return res.status(200).json({ success: true, message: 'Logged out successfully. Please delete the token on the client.' });
});

module.exports = router; 