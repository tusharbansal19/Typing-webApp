const socketIo = require('socket.io');
const redis = require('./utils/redis');
const Match = require('./model/match');

// Rooms are created dynamically on 'joinRoom' event from socket clients, not via REST API.
function initSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {


    ////console.log('New socket connection:', socket.id);


    socket.on('joinRoom', async ({ roomName, socketId, email }) => {


      if (!roomName) {
        ////console.log('[SOCKET] joinRoom called with undefined roomName, ignoring.');
        return;
      }



      ////console.log(`[SOCKET] joinRoom for roomName: ${roomName}`);
      socket.join(roomName);
      ////console.log("socket.id :: ",socket.id,"roomName :: ",roomName);
      // Fetch or create match state from Redis
      let roomState = await redis.hgetall(`match:${roomName}`);


      if(roomState.isStarted){
        return socket.to(socket.id).emit('matchAlreadyStarted', { message: 'Match already started' });
      }
      ////console.log("roomState :: ",roomName,"room is :: ", roomState);
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
      ////console.log(`[SOCKET] submitResult for roomName: ${roomName}`);
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
      ////console.log('User disconnected:', socket.id);
    });

    // CREATE GROUP TO JOIN (legacy, for completeness)
    socket.on('createGroupToJoin', async ({ roomName, userName }) => {
      ////console.log(`[SOCKET] createGroupToJoin for roomName: ${roomName}`);
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
      ////console.log(`[SOCKET] startGame for roomName: ${roomName}`);
      io.in(roomName).emit('gameStarted', { message: 'The game has started!' });
    });

    // GAME OVER
    socket.on('gameOver', async (roomName) => {
      ////console.log(`[SOCKET] gameOver for roomName: ${roomName}`);
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
      ////console.log("RoomState :: ",roomState);
      const allReady = participants.length > 0 && participants.every(p => p.ready);
      if (allReady) {
        // Update isStarted and emit matchStart with full info
        const mode = roomState.mode || 'multiplayer';
        const timeLimit = roomState.timeLimit ? Number(roomState.timeLimit) : 60;
        ////console.log("roomState.wordList :: ",roomState.wordList);
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

    // MATCH FINISH - Handle when a user completes the typing test
    socket.on('matchFinish', async (userStats) => {
      //console.log('[SOCKET] matchFinish received:', userStats);
      const { roomName, name, email, wpm, accuracy, mistakes, correctChars, totalTime } = userStats;
      
      if (!roomName) {
        //console.log('[SOCKET] matchFinish called with undefined roomName, ignoring.');
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
        //console.log('[SOCKET] Emitting matchResult with ranked results:', top5);
        io.to(roomName).emit('matchResult', { ranked: top5 });

        // Prepare data for Match schema
        const matchParticipants = rankedResults.map(r => ({
          user: null, // If you have userId, set it here
          username: r.name || r.email,
          wpm: r.wpm,
          accuracy: r.accuracy,
          errors: r.mistakes,
          totalTyped: r.correctChars
        }));
        const mode = roomState.mode || 'multiplayer';
        const timeLimit = roomState.timeLimit ? Number(roomState.timeLimit) : 60;
        const wordList = roomState.wordList || '';
        const startedAt = roomState.startedAt ? new Date(roomState.startedAt) : new Date(Date.now() - (timeLimit * 1000));
        const endedAt = new Date();
        const winnerId = null; // If you have userId for winner, set it here
        // Save to MongoDB
        try {
          await Match.create({
            participants: matchParticipants,
            mode,
            timeLimit,
            wordList,
            startedAt,
            endedAt,
            winnerId
          });
          //console.log('[SOCKET] Saved match results to MongoDB');
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
        }, 2000);
      }
    });
  });
}

module.exports = initSocket; 