const express = require('express');
const router = express.Router();
const Match = require('../model/match');
const { User } = require('../model/user'); // Import User model
const auth = require('../MIddleware/auth');
const redis = require('../utils/redis');

// Text samples for typing test (copied from frontend)
const TEXT_SAMPLES = [
  "this is a very extensive string composed of random words and phrases designed to meet your specific length requirement it continues to grow with various vocabulary choices ensuring it surpasses the five hundred character mark without using any punctuation whatsoever only lowercase letters and spaces are present throughout its entirety providing a continuous flow of text for your needs we are carefully adding more words to increase its overall length making sure it remains well above your requested minimum this paragraph demonstrates a large block of text suitable for many applications where a long character sequence without special symbols is desired it keeps going and going with more random words and less meaning sometimes just for the sake of length and character count validation we hope this extended passage serves its purpose effectively this is a very extensive string composed of random words and phrases designed to meet your specific length requirement it continues to grow with various vocabulary choices ensuring it surpasses the five hundred character mark without using any punctuation whatsoever only lowercase letters and spaces are present throughout its entirety providing a continuous flow of text for your needs we are carefully adding more words to increase its overall length making sure it remains well above your requested minimum this paragraph demonstrates a large block of text suitable for many applications where a long character sequence without special symbols is desired it keeps going and going with more random words and less meaning sometimes just for the sake of length and character count validation we hope this extended passage serves its purpose effectively",
  "learning new things is always an exciting adventure expanding your knowledge and understanding of the world around you every book you read every skill you acquire adds another layer to your personal growth and development the process of discovery can be incredibly rewarding opening up new perspectives and challenging your existing beliefs it encourages critical thinking and creativity allowing you to approach problems from different angles and find innovative solutions practice and persistence are key components in mastering any new subject or ability as consistent effort often leads to significant progress over time embracing mistakes as learning opportunities helps you refine your approach and build resilience the journey of continuous learning is endless with countless subjects and disciplines waiting to be explored it fosters curiosity and a lifelong passion for gaining insights into various fields whether it is science art history or technology there is always something fascinating to delve into and comprehend the more you learn the more you realize how much more there is to know which only fuels your desire for further exploration and intellectual enrichment making life a constant classroom of endless possibilities and exciting discoveries for every curious mind that seeks knowledge and understanding",
  "a gentle breeze swept through the tall grass making soft rustling sounds that echoed across the open fields the sky above was a vast expanse of light blue with only a few wispy clouds drifting lazily across the horizon in the distance you could see the faint outline of mountains their peaks touching the edge of the world creating a picturesque backdrop for the tranquil landscape birds chirped happily from the trees their melodies adding to the serene ambiance of the afternoon a small stream meandered through the fields its clear water sparkling under the sunlight inviting creatures to quench their thirst and cool themselves on this warm day the air was filled with the sweet scent of wildflowers blooming in various colors painting the meadows with vibrant hues the world seemed to slow down in this idyllic setting offering a moment of peace and quiet reflection away from the hustle and bustle of everyday life it was a perfect day for contemplation a time to simply exist and appreciate the simple beauty that nature so freely offered to those who took the time to notice and immerse themselves in its calming presence a true escape from the ordinary into something truly extraordinary and profoundly refreshing for the mind body and soul a wonderful experience indeed",
  "a gentle breeze swept through the tall grass making soft rustling sounds that echoed across the open fields the sky above was a vast expanse of light blue with only a few wispy clouds drifting lazily across the horizon in the distance you could see the faint outline of mountains their peaks touching the edge of the world creating a picturesque backdrop for the tranquil landscape birds chirped happily from the trees their melodies adding to the serene ambiance of the afternoon a small stream meandered through the fields its clear water sparkling under the sunlight inviting creatures to quench their thirst and cool themselves on this warm day the air was filled with the sweet scent of wildflowers blooming in various colors painting the meadows with vibrant hues the world seemed to slow down in this idyllic setting offering a moment of peace and quiet reflection away from the hustle and bustle of everyday life it was a perfect day for contemplation a time to simply exist and appreciate the simple beauty that nature so freely offered to those who took the time to notice and immerse themselves in its calming presence a true escape from the ordinary into something truly extraordinary and profoundly refreshing for the mind body and soul a wonderful experience indeed"
];

// Create a new match
router.post('/create', auth, async (req, res) => {
  try {
    // Validate user info
    if (!req.user || !req.user.id || !req.user.name || !req.user.email) {
      return res.status(400).json({ message: 'User authentication or user info missing' });
    }
    
    // Extract room configuration with defaults
    const roomConfig = req.body.roomConfig || {};
    const {
      playerLimit = 4,
      timer = 60,
      difficulty = 'normal',
      mode = 'multiplayer',
      isPrivate = false,
      allowSpectators = true
    } = roomConfig;

    // Validate configuration
    if (![2, 4, 6, 8, 10, 12].includes(playerLimit)) {
      return res.status(400).json({ message: 'Invalid player limit' });
    }
    if (![30, 60, 120, 180, 300, 600].includes(timer)) {
      return res.status(400).json({ message: 'Invalid timer value' });
    }
    if (!['easy', 'normal', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }
    if (!['multiplayer', 'tournament'].includes(mode)) {
      return res.status(400).json({ message: 'Invalid game mode' });
    }

    // Look up the user in the database to get ObjectId
    const dbUser = await User.findOne({ email: req.user.email });
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    // Select text based on difficulty
    let selectedText;
    if (difficulty === 'easy') {
      selectedText = TEXT_SAMPLES[0]; // Shorter, simpler text
    } else if (difficulty === 'hard') {
      selectedText = TEXT_SAMPLES[1]; // Longer, more complex text
    } else {
      selectedText = TEXT_SAMPLES[Math.floor(Math.random() * TEXT_SAMPLES.length)];
    }

    // Create the match in MongoDB
    const participantObj = {
      user: dbUser._id,
      username: req.user.name,
      email: req.user.email,
      wpm: 0,
      accuracy: 0,
      errors: 0,
      totalTyped: 0,
      status: 'notStarted',
      isReady: false,
      isHost: true
    };

    const matchDoc = await Match.create({
      participants: [participantObj],
      admin: dbUser._id, // Set creator as admin
      mode: mode,
      timeLimit: timer,
      playerLimit: playerLimit,
      difficulty: difficulty,
      isPrivate: isPrivate,
      allowSpectators: allowSpectators,
      allowNewPlayers: true, // Default to allowing new players
      isClosed: false, // Room is open by default
      wordList: selectedText,
      startedAt: null,
      endedAt: null,
      isStarted: false,
      winnerId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const roomId = matchDoc._id.toString();

    // Save match state in Redis
    try {
      await redis.hmset(`match:${roomId}`, {
        mode: mode,
        timeLimit: timer,
        playerLimit: playerLimit,
        difficulty: difficulty,
        isPrivate: isPrivate.toString(),
        allowSpectators: allowSpectators.toString(),
        allowNewPlayers: 'true',
        isClosed: 'false', // Room is open by default
        admin: dbUser._id.toString(),
        viewers: JSON.stringify([]),
        isStarted: false,
        endedAt: null,
        winnerId: null,
        startedAt: null,
        winner: null,
        started: false,
        participants: JSON.stringify([participantObj]),
        wordList: selectedText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (redisErr) {
      return res.status(500).json({ message: 'Failed to save match in Redis', error: redisErr.message });
    }

    return res.status(201).json({ 
      roomId, 
      hostName: req.user.name, 
      hostEmail: req.user.email,
      roomConfig: {
        playerLimit,
        timer,
        difficulty,
        mode,
        isPrivate,
        allowSpectators
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Add participant to a match by roomId, name, and email
router.post('/add-participant', auth, async (req, res) => {
  let { roomId, name, email } = req.body;
  
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User authentication missing' });
    }
    if (!roomId || typeof roomId !== 'string') {
      return res.status(400).json({ message: 'Room ID required and must be a string' });
    }
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if match exists in Redis
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match does not exist' });
    }
    if (matchState.started === 'true') {
      return res.status(403).json({ message: 'Match already started' });
    }

    // Check if new players are allowed
    if (matchState.allowNewPlayers !== 'true') {
      return res.status(403).json({ message: 'New players are not allowed to join this match' });
    }

    // Check if room is closed
    if (matchState.isClosed === 'true') {
      // Look up the user in the database to get ObjectId
      const dbUser = await User.findOne({ email });
      if (!dbUser) {
        return res.status(404).json({ message: 'User not found in database' });
      }

      // If room is closed, add user as viewer instead of participant
      let viewers = [];
      try {
        viewers = JSON.parse(matchState.viewers || '[]');
      } catch (e) {
        viewers = [];
      }

      // Get participants for response
      let participants = [];
      try {
        participants = JSON.parse(matchState.participants || '[]');
      } catch (e) {
        participants = [];
      }

      // Check if user is already a viewer
      if (viewers.find(v => v.email === email)) {
        return res.status(200).json({ 
          message: 'User already exists as viewer', 
          participants: participants,
          viewers: viewers,
          isViewer: true,
          hostName: participants[0]?.username, 
          hostEmail: participants[0]?.email,
          roomConfig: {
            playerLimit: parseInt(matchState.playerLimit) || 4,
            timer: parseInt(matchState.timeLimit) || 60,
            difficulty: matchState.difficulty || 'normal',
            mode: matchState.mode || 'multiplayer',
            isPrivate: matchState.isPrivate === 'true',
            allowSpectators: matchState.allowSpectators === 'true'
          }
        });
      }

      // Add new viewer
      const newViewer = {
        user: dbUser._id,
        username: name,
        email: email,
        joinedAt: new Date()
      };
      viewers.push(newViewer);

      await redis.hset(`match:${roomId}`, 'viewers', JSON.stringify(viewers));
      
      // Get participants for response
      // let participants = [];
      try {
        participants = JSON.parse(matchState.participants || '[]');
      } catch (e) {
        // participants = [];
      }
      
      const host = participants[0];
      return res.status(200).json({ 
        message: 'Added as viewer (room is closed)', 
        participants: participants,
        viewers: viewers,
        isViewer: true,
        hostName: host?.username, 
        hostEmail: host?.email,
        roomConfig: {
          playerLimit: parseInt(matchState.playerLimit) || 4,
          timer: parseInt(matchState.timeLimit) || 60,
          difficulty: matchState.difficulty || 'normal',
          mode: matchState.mode || 'multiplayer',
          isPrivate: matchState.isPrivate === 'true',
          allowSpectators: matchState.allowSpectators === 'true'
        }
      });
    }

    // Check player limit
    const playerLimit = parseInt(matchState.playerLimit) || 4;
    let participants;
    try {
      participants = JSON.parse(matchState.participants);
      if (!Array.isArray(participants)) participants = [];
    } catch (e) {
      participants = [];
    }

    // Check if room is full
    if (participants.length >= playerLimit) {
      return res.status(403).json({ message: 'Room is full' });
    }

    // Look up the user in the database to get ObjectId
    const dbUser = await User.findOne({ email });
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    // If user already exists (by user ObjectId or email), do not add again
    if (participants.find(p => String(p.user) === String(dbUser._id) || p.email === email)) {
      const host = participants[0];
      return res.status(200).json({ 
        message: 'Participant already exists', 
        participants, 
        hostName: host?.username, 
        hostEmail: host?.email,
        roomConfig: {
          playerLimit: parseInt(matchState.playerLimit) || 4,
          timer: parseInt(matchState.timeLimit) || 60,
          difficulty: matchState.difficulty || 'normal',
          mode: matchState.mode || 'multiplayer',
          isPrivate: matchState.isPrivate === 'true',
          allowSpectators: matchState.allowSpectators === 'true'
        }
      });
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
      status: 'notStarted',
      isHost: false,
      joinedAt: new Date()
    };
    participants.push(newParticipant);

    await redis.hset(`match:${roomId}`, 'participants', JSON.stringify(participants));
    
    const host = participants[0];
    return res.status(200).json({ 
      message: 'Participant added', 
      participants, 
      hostName: host?.username, 
      hostEmail: host?.email,
      roomConfig: {
        playerLimit: parseInt(matchState.playerLimit) || 4,
        timer: parseInt(matchState.timeLimit) || 60,
        difficulty: matchState.difficulty || 'normal',
        mode: matchState.mode || 'multiplayer',
        isPrivate: matchState.isPrivate === 'true',
        allowSpectators: matchState.allowSpectators === 'true'
      }
    });
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
  try {
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match does not exist' });
    }
    if (matchState.isStarted) {
      return res.status(403).json({ message: 'Match already started' });
    }
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
    return res.status(200).json({ 
      message: 'Match info', 
      participants, 
      hostName: host?.username, 
      hostEmail: host?.email,
      roomConfig: {
        playerLimit: parseInt(matchState.playerLimit) || 4,
        timer: parseInt(matchState.timeLimit) || 60,
        difficulty: matchState.difficulty || 'normal',
        mode: matchState.mode || 'multiplayer',
        isPrivate: matchState.isPrivate === 'true',
        allowSpectators: matchState.allowSpectators === 'true'
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Remove participant (admin only)
router.post('/remove-participant', auth, async (req, res) => {
  try {
    const { roomId, participantEmail } = req.body;
    
    if (!roomId || !participantEmail) {
      return res.status(400).json({ message: 'Room ID and participant email are required' });
    }

    // Get match state from Redis
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if user is admin
    if (matchState.admin !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can remove participants' });
    }

    // Parse participants
    let participants = [];
    try {
      participants = JSON.parse(matchState.participants);
    } catch (e) {
      return res.status(500).json({ message: 'Invalid participants data' });
    }

    // Remove participant
    const filteredParticipants = participants.filter(p => p.email !== participantEmail);
    
    if (filteredParticipants.length === participants.length) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Update Redis
    await redis.hset(`match:${roomId}`, 'participants', JSON.stringify(filteredParticipants));

    return res.status(200).json({ 
      message: 'Participant removed successfully',
      participants: filteredParticipants
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Toggle room closure (admin only)
router.post('/toggle-room-closure', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    
    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    // Get match state from Redis
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if user is admin
    if (matchState.admin !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can toggle room closure' });
    }

    // Toggle isClosed
    const currentIsClosed = matchState.isClosed === 'true';
    const newIsClosed = !currentIsClosed;

    // Update Redis
    await redis.hset(`match:${roomId}`, 'isClosed', newIsClosed.toString());

    return res.status(200).json({ 
      message: `Room ${newIsClosed ? 'closed' : 'opened'} successfully`,
      isClosed: newIsClosed
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Toggle new player access (admin only)
router.post('/toggle-new-players', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    
    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    // Get match state from Redis
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if user is admin
    if (matchState.admin !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can toggle new player access' });
    }

    // Toggle allowNewPlayers
    const currentAllowNewPlayers = matchState.allowNewPlayers === 'true';
    const newAllowNewPlayers = !currentAllowNewPlayers;

    // Update Redis
    await redis.hset(`match:${roomId}`, 'allowNewPlayers', newAllowNewPlayers.toString());

    return res.status(200).json({ 
      message: `New player access ${newAllowNewPlayers ? 'enabled' : 'disabled'}`,
      allowNewPlayers: newAllowNewPlayers
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Add viewer to match
router.post('/add-viewer', auth, async (req, res) => {
  try {
    const { roomId, name, email } = req.body;
    
    if (!roomId || !name || !email) {
      return res.status(400).json({ message: 'Room ID, name, and email are required' });
    }

    // Get match state from Redis
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if match allows spectators
    if (matchState.allowSpectators !== 'true') {
      return res.status(403).json({ message: 'Spectators not allowed in this match' });
    }

    // Parse viewers
    let viewers = [];
    try {
      viewers = JSON.parse(matchState.viewers || '[]');
    } catch (e) {
      viewers = [];
    }

    // Check if user is already a viewer
    if (viewers.find(v => v.email === email)) {
      return res.status(200).json({ 
        message: 'Viewer already exists',
        viewers: viewers
      });
    }

    // Add new viewer
    const newViewer = {
      user: req.user.id,
      username: name,
      email: email,
      joinedAt: new Date()
    };
    viewers.push(newViewer);

    // Update Redis
    await redis.hset(`match:${roomId}`, 'viewers', JSON.stringify(viewers));

    return res.status(200).json({ 
      message: 'Viewer added successfully',
      viewers: viewers
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get match info with admin and viewer details
router.get('/info/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Get match state from Redis
    const matchState = await redis.hgetall(`match:${roomId}`);
    if (!matchState) {
      return res.status(404).json({ message: 'Match not found' });
    }

    let participants = [];
    let viewers = [];
    
    try {
      participants = JSON.parse(matchState.participants || '[]');
      viewers = JSON.parse(matchState.viewers || '[]');
    } catch (e) {
      participants = [];
      viewers = [];
    }

    const isAdmin = matchState.admin === req.user.id;
    const isParticipant = participants.some(p => p.email === req.user.email);
    const isViewer = viewers.some(v => v.email === req.user.email);
    
    // Check if admin is present in participants
    const adminParticipant = participants.find(p => p.isHost);
    const adminPresent = adminParticipant && participants.some(p => p.email === adminParticipant.email);

    return res.status(200).json({
      roomId,
      isAdmin,
      isParticipant,
      isViewer,
      participants,
      viewers,
      allowNewPlayers: matchState.allowNewPlayers === 'true',
      allowSpectators: matchState.allowSpectators === 'true',
      isRoomClosed: matchState.isClosed === 'true',
      adminPresent,
      isStarted: matchState.isStarted === 'true',
      mode: matchState.mode,
      timeLimit: parseInt(matchState.timeLimit) || 60,
      playerLimit: parseInt(matchState.playerLimit) || 4,
      difficulty: matchState.difficulty || 'normal'
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete all matches
// const fn= async (req, res) => {
//   try {
//     const result = await Match.deleteMany({});
//     ////console.log("Deleted all matches....");
//     // return res.status(200).json({ message: 'All matches deleted', deletedCount: result.deletedCount });
//   } catch (err) {
//     ////console.log("Error deleting matches....");
//     // return res.status(500).json({ message: err.message });
//   }}
// fn();

// Get participant stats for a room
router.get('/stats/:roomName', async (req, res) => {
  try {
    const { roomName } = req.params;
    const roomState = await redis.hgetall(`match:${roomName}`);
    
    if (!roomState) {
      return res.status(404).json({ 
        success: false, 
        message: 'Room not found' 
      });
    }

    let participantStats = [];
    try { 
      participantStats = JSON.parse(roomState.participantStats || '[]'); 
    } catch { 
      participantStats = []; 
    }

    return res.status(200).json({ 
      success: true, 
      participantStats,
      roomName 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

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