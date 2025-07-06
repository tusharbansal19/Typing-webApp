const express = require('express');
const { User } = require('../model/user');
const { signToken, verifyToken   } = require('../utils/jwt');
const auth = require('../MIddleware/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();
// const jwt = require('jsonwebtoken');

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

// Get user profile with match history
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'matches',
        select: 'participants mode timeLimit startedAt endedAt winnerId',
        options: { sort: { createdAt: -1 }, limit: 50 } // Increased limit to get more matches
      });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate user stats from matches
    let totalMatches = 0;
    let wins = 0;
    let personalBest = { wpm: 0, accuracy: 0 };
    let recentMatches = [];

    if (user.matches && user.matches.length > 0) {
      totalMatches = user.matches.length;
      
      // Process each match to find user's performance
      user.matches.forEach(match => {
        const userParticipant = match.participants.find(p => 
          p.user && p.user.toString() === user._id.toString()
        );
        
        if (userParticipant) {
          // Check if this is a win
          if (match.winnerId && match.winnerId.toString() === user._id.toString()) {
            wins++;
          }
          
          // Update personal best
          if (userParticipant.wpm > personalBest.wpm) {
            personalBest.wpm = userParticipant.wpm;
          }
          if (userParticipant.accuracy > personalBest.accuracy) {
            personalBest.accuracy = userParticipant.accuracy;
          }
          
          // Add to recent matches
          recentMatches.push({
            id: match._id,
            mode: match.mode,
            wpm: userParticipant.wpm,
            accuracy: userParticipant.accuracy,
            result: match.winnerId && match.winnerId.toString() === user._id.toString() ? 'win' : 'loss',
            time: match.endedAt ? new Date(match.endedAt).toLocaleDateString() : 'N/A',
            startedAt: match.startedAt
          });
        }
      });
    }

    // Update user's personal best in database if it has changed
    if (personalBest.wpm > (user.personalBest?.wpm || 0) || 
        personalBest.accuracy > (user.personalBest?.accuracy || 0)) {
      await User.findByIdAndUpdate(user._id, {
        personalBest: {
          wpm: Math.max(personalBest.wpm, user.personalBest?.wpm || 0),
          accuracy: Math.max(personalBest.accuracy, user.personalBest?.accuracy || 0)
        }
      });
    }

    const profileData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
        joinDate: user.createdAt,
        status: "Available for Challenge"
      },
      stats: {
        totalMatches,
        wins,
        winRate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
        personalBest: {
          wpm: Math.max(personalBest.wpm, user.personalBest?.wpm || 0),
          accuracy: Math.max(personalBest.accuracy, user.personalBest?.accuracy || 0)
        },
        currentStreak: 0 // This would need to be calculated from match history
      },
      recentMatches: recentMatches.slice(0, 10) // Increased to show more recent matches
    };

    return res.status(200).json({ success: true, data: profileData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatarUrl } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;
    
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get user match history
router.get('/matches', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Increased default limit
    const skip = (page - 1) * limit;

    // Get total count of user's matches
    const totalMatches = await User.findById(req.user.id).populate({
      path: 'matches',
      select: '_id',
      options: { sort: { createdAt: -1 } }
    });

    const user = await User.findById(req.user.id).populate({
      path: 'matches',
      select: 'participants mode timeLimit startedAt endedAt winnerId',
      options: { sort: { createdAt: -1 }, skip, limit }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const matches = user.matches.map(match => {
      const userParticipant = match.participants.find(p => 
        p.user && p.user.toString() === user._id.toString()
      );
      
      return {
        id: match._id,
        mode: match.mode,
        wpm: userParticipant?.wpm || 0,
        accuracy: userParticipant?.accuracy || 0,
        result: match.winnerId && match.winnerId.toString() === user._id.toString() ? 'win' : 'loss',
        time: match.endedAt ? new Date(match.endedAt).toLocaleDateString() : 'N/A',
        startedAt: match.startedAt
      };
    });

    return res.status(200).json({ 
      success: true, 
      matches,
      pagination: {
        page,
        limit,
        total: totalMatches.matches.length
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router; 