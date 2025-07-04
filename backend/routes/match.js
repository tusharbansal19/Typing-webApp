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
      email: req.user.email,
      wpm: 0,
      accuracy: 0,
      status: 'notStarted',
      errors: 0,
      totalTyped: 0,
    };
    const matchDoc = await Match.create({
      participants: [participantObj],
      mode: 'multiplayer',
      timeLimit: 60,
      wordList: "a gentle breeze swept through the tall grass making soft rustling sounds that echoed across the open fields the sky above was a vast expanse of light blue with only a few wispy clouds drifting lazily across the horizon in the distance you could see the faint outline of mountains their peaks touching the edge of the world creating a picturesque backdrop for the tranquil landscape birds chirped happily from the trees their melodies adding to the serene ambiance of the afternoon a small stream meandered through the fields its clear water sparkling under the sunlight inviting creatures to quench their thirst and cool themselves on this warm day the air was filled with the sweet scent of wildflowers blooming in various colors painting the meadows with vibrant hues the world seemed to slow down in this idyllic setting offering a moment of peace and quiet reflection away from the hustle and bustle of everyday life it was a perfect day for contemplation a time to simply exist and appreciate the simple beauty that nature so freely offered to those who took the time to notice and immerse themselves in its calming presence a true escape from the ordinary into something truly extraordinary and profoundly refreshing for the mind body and soul a wonderful experience indeed",
      
      startedAt: null,
      endedAt: null,
      isStarted: false,
      winnerId: null,
    });
    const roomId = matchDoc._id.toString();
    participantObj.isReady = false;
    ////console.log("participantObj",participantObj);
    // Save match state in Redis using the same ObjectId
    try {
      await redis.hmset(`match:${roomId}`, {
        mode: 'multiplayer',
        timeLimit: 10,
        isStarted: false,
        endedAt: null,
        winnerId: null,
        startedAt: null,
        winner: null,

        started: false,
        participants: JSON.stringify([participantObj]),
        wordList: "a gentle breeze swept through the tall grass making soft rustling sounds that echoed across the open fields the sky above was a vast expanse of light blue with only a few wispy clouds drifting lazily across the horizon in the distance you could see the faint outline of mountains their peaks touching the edge of the world creating a picturesque backdrop for the tranquil landscape birds chirped happily from the trees their melodies adding to the serene ambiance of the afternoon a small stream meandered through the fields its clear water sparkling under the sunlight inviting creatures to quench their thirst and cool themselves on this warm day the air was filled with the sweet scent of wildflowers blooming in various colors painting the meadows with vibrant hues the world seemed to slow down in this idyllic setting offering a moment of peace and quiet reflection away from the hustle and bustle of everyday life it was a perfect day for contemplation a time to simply exist and appreciate the simple beauty that nature so freely offered to those who took the time to notice and immerse themselves in its calming presence a true escape from the ordinary into something truly extraordinary and profoundly refreshing for the mind body and soul a wonderful experience indeed",
      });
      ////console.log(`[REDIS] Created match:${roomId} with participants:`, [participantObj]);
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
  // roomId = roomId.toLowerCase();
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
    let participants;
    try {
      participants = JSON.parse(matchState.participants);
      if (!Array.isArray(participants)) participants = [];
    } catch (e) {
      participants = [];
    }
    ////console.log("participants of add-participant",roomId," ; ", participants);
    // If user already exists (by user ObjectId or email), do not add again
    if (participants.find(p => String(p.user) === String(dbUser._id) || p.email === email)) {
      const host = participants[0];
      return res.status(200).json({ message: 'Participant already exists', participants, hostName: host?.username, hostEmail: host?.email });
    }
    // Add new participant
    const newParticipant = {
      user: dbUser._id,
      email: email,
      isReady: false,
      username: name,
      wpm: 0,
      accuracy: 0,
      errors: 0,
      totalTyped: 0,
    };
    participants.push(newParticipant);
    // ////console.log("participants of add-participant", participants);
    await redis.hset(`match:${roomId}`, 'participants', JSON.stringify(participants));
    ////console.log(`[REDIS] Updated match:${roomId} participants    -> : `, participants);
    try {
      ////console.log("participants of add-participant", roomId, " ; ", participants);
    } catch (redisErr) {
      return res.status(500).json({ message: 'Failed to update participants in Redis', error: redisErr.message });
    }
    const host = participants[0];
    return res.status(200).json({ message: 'Participant added', participants, hostName: host?.username, hostEmail: host?.email });
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
  // roomId = roomId.toLowerCase();
  try {
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match does not exist' });
    }
    if (matchState.started === 'true') {
      return res.status(403).json({ message: 'Match already started' });
    }
    ////console.log("matchState of join", matchState);
    ////console.log("matchState of join", matchState.participants);
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
    return res.status(200).json({ message: 'Match info', participants, hostName: host?.username, hostEmail: host?.email });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete all matches
const fn= async (req, res) => {
  try {
    const result = await Match.deleteMany({});
    ////console.log("Deleted all matches....");
    // return res.status(200).json({ message: 'All matches deleted', deletedCount: result.deletedCount });
  } catch (err) {
    ////console.log("Error deleting matches....");
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