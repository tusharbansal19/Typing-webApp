const express = require('express');
const router = express.Router();
const Match = require('../model/match');
const auth = require('../MIddleware/auth');
const { v4: uuidv4 } = require('uuid');

// POST /api/match/create
router.post('/create', auth, async (req, res) => {
  try {
    // Generate a unique roomId
    const roomId = uuidv4();
    // Create a new match document
    // const match = await Match.create({
    //   participants: [],
    //   mode: 'multiplayer',
    //   timeLimit: 60, // default, can be customized
    //   wordList: [], // can be filled later
    //   startedAt: null,
    //   endedAt: null,
    //   winnerId: null,
    //   _id: roomId // use as roomId for socket
    // });
    return res.status(201).json({ roomId: roomId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router; 