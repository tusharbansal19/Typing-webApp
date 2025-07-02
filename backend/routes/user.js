const express = require('express');
const user = require('../model/user');
const { signToken } = require('../utils/jwt');
const auth = require('../middleware/auth');
const router = express.Router();

// Signup
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });
    let existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    let useri = await user.create({ name, email, password });
    let accessToken = signToken({ name, email, id: useri._id });
    return res.status(200).json({
      success: true,
      message: 'Signup successful',
      accessToken,
      user: { name: useri.name, email: useri.email, id: useri._id }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });
    let useri = await user.findOne({ email });
    if (!useri || useri.password !== password)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    let accessToken = signToken({ name: useri.name, email: useri.email, id: useri._id });
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: { name: useri.name, email: useri.email, id: useri._id }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get current user from token
router.get('/me', auth, async (req, res) => {
  try {
    return res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 