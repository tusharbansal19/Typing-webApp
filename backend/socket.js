const socketIo = require('socket.io');
const redis = require('./utils/redis');
const Match = require('./model/match');
const { User } = require('./model/user');

// Helper function to update user match details
async function updateUserMatchDetails(userEmail, matchId, isWinner = false, wpm = 0, accuracy = 0) {
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      //console.log(`[SOCKET] User not found for email: ${userEmail}`);
      return false;
    }

    // Update user's match history and stats
    const updateData = {
      $push: { matches: matchId },
      $inc: { totalMatches: 1 }
    };

    // Update personal best if current performance is better
    if (wpm > (user.personalBest?.wpm || 0)) {
      updateData.$set = { ...updateData.$set, 'personalBest.wpm': wpm };
    }
    if (accuracy > (user.personalBest?.accuracy || 0)) {
      updateData.$set = { ...updateData.$set, 'personalBest.accuracy': accuracy };
    }

    // Update wins count if user is winner
    if (isWinner) {
      updateData.$inc.wins = 1;
    }

    await User.findByIdAndUpdate(user._id, updateData);
    //console.log(`[SOCKET] Updated user ${userEmail} match details`);
    return true;
  } catch (error) {
    //console.error(`[SOCKET] Error updating user ${userEmail} match details:`, error);
    return false;
  }
}

// Rooms are created dynamically on 'joinRoom' event from socket clients, not via REST API.
function initSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {


    //////console.log('New socket connection:', socket.id);


    socket.on('joinRoom', async ({ roomName, socketId, email }) => {


      if (!roomName) {
        //////console.log('[SOCKET] joinRoom called with undefined roomName, ignoring.');
        return;
      }



      //////console.log(`[SOCKET] joinRoom for roomName: ${roomName}`);
      socket.join(roomName);
      //////console.log("socket.id :: ",socket.id,"roomName :: ",roomName);
      // Fetch or create match state from Redis
      let roomState = await redis.hgetall(`match:${roomName}`);
      if(roomState.isStarted){
        return socket.to(socket.id).emit('matchAlreadyStarted', { message: 'Match already started' });
      }
      //////console.log("roomState :: ",roomName,"room is :: ", roomState);
      let participants = [];
      try { participants = JSON.parse(roomState.participants); } catch { participants = []; }
      // Ensure each participant has _id, email, username
      participants = participants.map(p => ({
        _id: p._id ,
        email: p.email,
        username: p.username ,
      }));
      io.to(roomName).emit('all participants', { participants , roomName});
      // Emit userJoined event for new user
      const newUser = participants.find(p => p.email === email);
      if (newUser) {
        io.to(roomName).emit('userJoined', { user: newUser, participants, roomName });
      }
      if (newUser) {
        io.to(socket.id).emit('meJoined', { user: newUser, participants, roomName });
      }
      


    });

    // SUBMIT RESULT
    socket.on('submitResult', async ({ roomName, speed, accuracy, email }) => {
      //////console.log(`[SOCKET] submitResult for roomName: ${roomName}`);
      if (!roomName) return;
      let roomState = await redis.hgetall(`match:${roomName}`);
      if (!roomState.members) return;
      let members = [];
      let submissions = [];
      try { members = JSON.parse(roomState.members); } catch { members = []; }
      try { submissions = JSON.parse(roomState.submissions); } catch { submissions = []; }
      submissions.push({ id: socket.id, speed, accuracy, email });
      await redis.hset(`match:${roomName}`, 'submissions', JSON.stringify(submissions));
      if (submissions.length === members.length) {
        const rankedPlayers = submissions
          .sort((a, b) => b.speed - a.speed || b.accuracy - a.accuracy)
          .map((player, index) => ({ ...player, rank: index + 1 }));
        io.to(roomName).emit('showRanks', rankedPlayers);
        await redis.hset(`match:${roomName}`, 'readyPlayers', JSON.stringify([]));
        await redis.hset(`match:${roomName}`, 'submissions', JSON.stringify([]));
      }
    });

    // PLAYER READY
 

    // DISCONNECT
    socket.on('disconnect', async () => {
      for (let [key, entry] of redis.store.entries()) {
        if (key.startsWith('match:')) {
          let roomState = entry.value;
          let participants = [];
          try { participants = JSON.parse(roomState.participants || '[]'); } catch { participants = []; }
          // Find participant by socket id (if stored)
          // If you store socket id in participant, remove by id, else skip
          // For now, skip if not tracked
          // Optionally, you could track socket id in participant for more robust removal
          // For now, just emit all participants with roomName
          io.to(key.replace('match:', '')).emit('all participants', { participants, roomName: key.replace('match:', '') });
        }
      }
      //////console.log('User disconnected:', socket.id);
    });

    // CREATE GROUP TO JOIN (legacy, for completeness)
    socket.on('createGroupToJoin', async ({ roomName, userName }) => {
      //////console.log(`[SOCKET] createGroupToJoin for roomName: ${roomName}`);
      if (!roomName) return;
      let roomState = await redis.hgetall(`match:${roomName}`);
      if (!roomState.groupMembers) roomState.groupMembers = JSON.stringify([]);
      let groupMembers = [];
      try { groupMembers = JSON.parse(roomState.groupMembers); } catch { groupMembers = []; }
      groupMembers.push({ id: socket.id, userName });
      await redis.hset(`match:${roomName}`, 'groupMembers', JSON.stringify(groupMembers));
      io.in(roomName).emit('updateGroupMembers', groupMembers);
    });

    // START GAME
    socket.on('startGame', async (roomName) => {
      //////console.log(`[SOCKET] startGame for roomName: ${roomName}`);
      io.in(roomName).emit('gameStarted', { message: 'The game has started!' });
    });

    // GAME OVER
    socket.on('gameOver', async (roomName) => {
      //////console.log(`[SOCKET] gameOver for roomName: ${roomName}`);
      io.in(roomName).emit('gameOver', { message: 'Game Over!' });
    });

    // LEAVE ROOM
    socket.on('leave room', async (roomName, email) => {
      if (!roomName || !email) return;
      let roomState = await redis.hgetall(`match:${roomName}`);
      let participants = [];
      try { participants = JSON.parse(roomState.participants || '[]'); } catch { participants = []; }
      // Remove the participant with the given email
      const removedUser = participants.find(p => p.email === email);
      const newParticipants = participants.filter(p => p.email !== email);
      await redis.hset(`match:${roomName}`, 'participants', JSON.stringify(newParticipants));
      io.to(roomName).emit('all participants', { participants: newParticipants, roomName });
      if (removedUser) {
        io.to(roomName).emit('userLeft', { user: removedUser, participants: newParticipants, roomName });
      }
    });

    // CHANGE STATUS (toggle ready)
    socket.on('changeStatus', async ({ roomName, email }) => {
      if (!roomName || !email) return;
      let roomState = await redis.hgetall(`match:${roomName}`);
      if (!roomState.participants) return;
      let participants = [];
      try { participants = JSON.parse(roomState.participants); } catch { participants = []; }
      participants = participants.map(p =>
        p.email === email ? { ...p, ready: !p.ready } : p
      );
      await redis.hset(`match:${roomName}`, 'participants', JSON.stringify(participants));
      io.to(roomName).emit('statusUpdated', { participants, roomName });

      // Check if all participants are ready
      //////console.log("RoomState :: ",roomState);
      const allReady = participants.length > 0 && participants.every(p => p.ready);
      if (allReady) {
        // Update isStarted and emit matchStart with full info
        const mode = roomState.mode || 'multiplayer';
        const timeLimit = roomState.timeLimit ? Number(roomState.timeLimit) : 60;
        //////console.log("roomState.wordList :: ",roomState.wordList);
        const wordList = roomState.wordList;
        await redis.hset(`match:${roomName}`, 'isStarted', true);
        io.to(roomName).emit('matchStart', {
          roomName,
          participants,
          mode,
          timeLimit,
          wordList,
          isStarted: true,
        });
      }
    });

    // REAL-TIME PARTICIPANT UPDATE - Handle live WPM/accuracy updates
    socket.on('participantUpdate', async (data) => {
      const { roomName, email, wpm, accuracy } = data;
      
      if (!roomName || !email) {
        //console.log('[SOCKET] participantUpdate called with missing data, ignoring.');
        return;
      }

      // Store participant stats in Redis
      let roomState = await redis.hgetall(`match:${roomName}`);
      let participantStats = [];
      try { 
        participantStats = JSON.parse(roomState.participantStats || '[]'); 
      } catch { 
        participantStats = []; 
      }

      // Update or add participant stats
      const existingIndex = participantStats.findIndex(p => p.email === email);
      const updatedStats = {
        email,
        wpm: wpm || 0,
        accuracy: accuracy || 100,
        timestamp: Date.now()
      };

      if (existingIndex >= 0) {
        participantStats[existingIndex] = updatedStats;
      } else {
        participantStats.push(updatedStats);
      }

      // Store updated stats in Redis
      await redis.hset(`match:${roomName}`, 'participantStats', JSON.stringify(participantStats));

      // Broadcast to all participants in the room
      io.to(roomName).emit('participantUpdate', updatedStats);
      
    });

    // REQUEST ALL PARTICIPANT STATS - Get current stats for all participants
    socket.on('requestParticipantStats', async (roomName) => {
      if (!roomName) return;
      
      let roomState = await redis.hgetall(`match:${roomName}`);
      let participantStats = [];
      try { 
        participantStats = JSON.parse(roomState.participantStats || '[]'); 
      } catch { 
        participantStats = []; 
      }

      // Send all participant stats to the requesting client
      socket.emit('allParticipantStats', { participantStats, roomName });
    });

    // MATCH FINISH - Handle when a user completes the typing test
    socket.on('matchFinish', async (userStats) => {
      ////console.log('[SOCKET] matchFinish received:', userStats);
      const { roomName, name, email, wpm, accuracy, mistakes, correctChars, totalTime } = userStats;
      
      if (!roomName) {
        ////console.log('[SOCKET] matchFinish called with undefined roomName, ignoring.');
        return;
      }

      // Store the result in Redis
      let roomState = await redis.hgetall(`match:${roomName}`);
      let results = [];
      try { 
        results = JSON.parse(roomState.results || '[]'); 
      } catch { 
        results = []; 
      }

      // Add the user's result
      const userResult = {
        name,
        email,
        wpm,
        accuracy,
        mistakes,
        correctChars,
        totalTime,
        timestamp: Date.now()
      };

      results.push(userResult);
      await redis.hset(`match:${roomName}`, 'results', JSON.stringify(results));

      // Get all participants to check if everyone has finished
      let participants = [];
      try { 
        participants = JSON.parse(roomState.participants || '[]'); 
      } catch { 
        participants = []; 
      }

      // If all participants have finished, emit matchResult with top 5
      if (results.length >= participants.length) {
        // Sort by WPM (highest first), then by accuracy, then by fewer mistakes
        const rankedResults = results
          .sort((a, b) => {
            if (b.wpm !== a.wpm) return b.wpm - a.wpm;
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
            return a.mistakes - b.mistakes;
          })
          .map((result, index) => ({
            ...result,
            position: index + 1
          }));
        const top5 = rankedResults.slice(0, 5);
        ////console.log('[SOCKET] Emitting matchResult with ranked results:', top5);
        io.to(roomName).emit('matchResult', { ranked: top5 });

        // Prepare data for Match schema and get user IDs
        const matchParticipants = [];
        const userIds = [];
        
        for (const r of rankedResults) {
          try {
            // Find user by email
            const user = await User.findOne({ email: r.email });
            if (user) {
              matchParticipants.push({
                user: user._id,
                username: r.name || r.email,
                wpm: r.wpm,
                accuracy: r.accuracy,
                errors: r.mistakes,
                totalTyped: r.correctChars
              });
              userIds.push(user._id);
            } else {
              // Fallback for users not found
              matchParticipants.push({
                user: null,
                username: r.name || r.email,
                wpm: r.wpm,
                accuracy: r.accuracy,
                errors: r.mistakes,
                totalTyped: r.correctChars
              });
            }
          } catch (err) {
            //console.error('[SOCKET] Error finding user:', err);
            matchParticipants.push({
              user: null,
              username: r.name || r.email,
              wpm: r.wpm,
              accuracy: r.accuracy,
              errors: r.mistakes,
              totalTyped: r.correctChars
            });
          }
        }
        
        const mode = roomState.mode || 'multiplayer';
        const timeLimit = roomState.timeLimit ? Number(roomState.timeLimit) : 60;
        const wordList = roomState.wordList || '';
        const startedAt = roomState.startedAt ? new Date(roomState.startedAt) : new Date(Date.now() - (timeLimit * 1000));
        const endedAt = new Date();
        const winnerId = userIds[0] || null; // First user is the winner
        
        // Save to MongoDB
        try {
          const match = await Match.create({
            participants: matchParticipants,
            mode,
            timeLimit,
            wordList,
            startedAt,
            endedAt,
            winnerId
          });
          
          //console.log('[SOCKET] Saved match results to MongoDB');



          
          // Update each participant's match details
          for (let i = 0; i < rankedResults.length; i++) {
            const result = rankedResults[i];
            const isWinner = i === 0; // First result is the winner
            
            await updateUserMatchDetails(
              result.email,
              match._id,
              isWinner,
              result.wpm,
              result.accuracy
            );
          }
          
          //console.log('[SOCKET] Updated all participants match details');
        } catch (err) {
          //console.error('[SOCKET] Error saving match results to MongoDB:', err);
        }
        // After 5 seconds, clear Redis for this room
        setTimeout(async () => {
          try {
            await redis.del(`match:${roomName}`);
            //console.log(`[SOCKET] Cleared Redis data for room: ${roomName}`);
          } catch (err) {
            //console.error(`[SOCKET] Error clearing Redis for room ${roomName}:`, err);
          }
        }, 5000);
      }
    });
  });
}

module.exports = initSocket; 