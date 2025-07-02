const express = require('express');
const router = express.Router();
const Match = require('../model/match');
const auth = require('../MIddleware/auth');
const redis = require('../utils/redis');

// Create a new match
router.post('/create', auth, async (req, res) => {
  try {
    // Create the match in MongoDB (let MongoDB generate the _id)
    const matchDoc = await Match.create({
      participants: [],
      mode: 'multiplayer',
      timeLimit: 60,
      wordList: [],
      startedAt: null,
      endedAt: null,
      winnerId: null,
    });
    const roomId = matchDoc._id.toString();
    // Save match state in Redis using the same ObjectId
    await redis.hmset(`match:${roomId}`, {
      started: false,
      participants: JSON.stringify([{ id: req.user.id, name: req.user.name, email: req.user.email }]),
    });
    return res.status(201).json({ roomId, hostName: req.user.name, hostEmail: req.user.email });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Join a match
router.post('/join', auth, async (req, res) => {
  const { roomId } = req.body;
  if (!roomId) return res.status(400).json({ message: 'Room ID required' });

  // Check if match exists in Redis
  const matchState = await redis.hgetall(`match:${roomId}`);
  if (!matchState || Object.keys(matchState).length === 0) {
    return res.status(404).json({ message: 'Match does not exist' });
  }
  if (matchState.started === 'true') {
    return res.status(403).json({ message: 'Match already started' });
  }
  // Check if user is already in participants
  let participants = JSON.parse(matchState.participants || '[]');
  if (participants.find(p => p.id === req.user.id)) {
    return res.status(409).json({ message: 'Already joined' });
  }
  // Add user to participants
  participants.push({ id: req.user.id, name: req.user.name, email: req.user.email });
  await redis.hset(`match:${roomId}`, 'participants', JSON.stringify(participants));
  // Host is the first participant
  const host = participants[0];
  return res.status(200).json({ message: 'Joined match', participants, hostName: host?.name, hostEmail: host?.email });
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

module.exports = router; 