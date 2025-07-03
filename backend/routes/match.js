const express = require('express');
const router = express.Router();
const Match = require('../model/match');
const { User } = require('../model/user'); // Import User model
const auth = require('../MIddleware/auth');
const redis = require('../utils/redis');

// Create a new match
router.post('/create', auth, async (req, res) => {
  try {
    // Validate user info
    if (!req.user || !req.user.id || !req.user.name || !req.user.email) {
      return res.status(400).json({ message: 'User authentication or user info missing' });
    }
    // Look up the user in the database to get ObjectId
    const dbUser = await User.findOne({ email: req.user.email });
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found in database' });
    }
    // Create the match in MongoDB (let MongoDB generate the _id)
    const participantObj = {
      user: dbUser._id,
      username: req.user.name,
      wpm: 0,
      accuracy: 0,
      errors: 0,
      totalTyped: 0,
    };
    const matchDoc = await Match.create({
      participants: [participantObj],
      mode: 'multiplayer',
      timeLimit: 60,
      wordList: [],
      startedAt: null,
      endedAt: null,
      winnerId: null,
    });
    const roomId = matchDoc._id.toString().toLowerCase();
    // Save match state in Redis using the same ObjectId
    try {
      await redis.hmset(`match:${roomId}`, {
        started: false,
        participants: JSON.stringify([participantObj]),
      });
      console.log(`[REDIS] Created match:${roomId} with participants:`, [participantObj]);
    } catch (redisErr) {
      return res.status(500).json({ message: 'Failed to save match in Redis', error: redisErr.message });
    }
    return res.status(201).json({ roomId, hostName: req.user.name, hostEmail: req.user.email });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Add participant to a match by roomId, name, and email
router.post('/add-participant', auth, async (req, res) => {
  let { roomId, name, email } = req.body;
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: 'User authentication missing' });
  }
  if (!roomId || typeof roomId !== 'string') {
    return res.status(400).json({ message: 'Room ID required and must be a string' });
  }
  roomId = roomId.toLowerCase();
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  try {
    // Check if match exists in Redis
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match does not exist' });
    }
    if (matchState.started === 'true') {
      return res.status(403).json({ message: 'Match already started' });
    }
    // Look up the user in the database to get ObjectId
    const dbUser = await User.findOne({ email });
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found in database' });
    }
    let participants = [];
    try {
      participants = JSON.parse(matchState.participants);
      if (!Array.isArray(participants)) participants = [];
    } catch (e) {
      participants = [];
    }
    // If user already exists (by user ObjectId), do not add again
    if (participants.find(p => String(p.user) === String(dbUser._id))) {
      const host = participants[0];
      return res.status(200).json({ message: 'Participant already exists', participants, hostName: host?.username, hostEmail: email });
    }
    // Add new participant
    const newParticipant = {
      user: dbUser._id,
      username: name,
      wpm: 0,
      accuracy: 0,
      errors: 0,
      totalTyped: 0,
    };
    participants.push(newParticipant);
    try {
      await redis.hset(`match:${roomId}`, 'participants', JSON.stringify(participants));
      console.log(`[REDIS] Updated match:${roomId} participants:`, participants);
    } catch (redisErr) {
      return res.status(500).json({ message: 'Failed to update participants in Redis', error: redisErr.message });
    }
    const host = participants[0];
    return res.status(200).json({ message: 'Participant added', participants, hostName: host?.username, hostEmail: email });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Join a match (no longer adds participant)
router.post('/join', auth, async (req, res) => {
  let { roomId } = req.body;
  if (!req.user || !req.user.id || !req.user.name || !req.user.email) {
    return res.status(400).json({ message: 'User authentication or user info missing' });
  }
  if (!roomId || typeof roomId !== 'string') {
    return res.status(400).json({ message: 'Room ID required and must be a string' });
  }
  roomId = roomId.toLowerCase();
  try {
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match does not exist' });
    }
    if (matchState.started === 'true') {
      return res.status(403).json({ message: 'Match already started' });
    }
    console.log("matchState of join", matchState);
    console.log("matchState of join", matchState.participants);
    if (!matchState.participants) {
      return res.status(500).json({ message: 'Participants missing in match state' });
    }
    let participants;
    try {
      participants = JSON.parse(matchState.participants);
      if (!Array.isArray(participants)) throw new Error('Participants not array');
    } catch (e) {
      return res.status(500).json({ message: 'Participants data corrupted' });
    }
    const host = participants[0];
    return res.status(200).json({ message: 'Match info', participants, hostName: host?.username, hostEmail: req.user.email });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete all matches
const fn= async (req, res) => {
  try {
    const result = await Match.deleteMany({});
    console.log("Deleted all matches....");
    // return res.status(200).json({ message: 'All matches deleted', deletedCount: result.deletedCount });
  } catch (err) {
    console.log("Error deleting matches....");
    // return res.status(500).json({ message: err.message });
  }}
fn();

// Clear all match keys in Redis (for testing only!)
router.post('/clear-redis-matches', async (req, res) => {
  let count = 0;
  for (let [key] of redis.store.entries()) {
    if (key.startsWith('match:')) {
      redis.store.delete(key);
      count++;
    }
  }
  res.json({ message: `Cleared ${count} match keys in Redis` });
});

module.exports = router; 