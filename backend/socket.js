const socketIo = require('socket.io');
const redis = require('./utils/redis');

// Rooms are created dynamically on 'joinRoom' event from socket clients, not via REST API.
function initSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    // JOIN ROOM
    socket.on('joinRoom', async ({ roomName, socketId, email }) => {
      if (!roomName) {
        console.log('[SOCKET] joinRoom called with undefined roomName, ignoring.');
        return;
      }
      console.log(`[SOCKET] joinRoom for roomName: ${roomName}`);
      socket.join(roomName);
      // Fetch or create match state from Redis
      let roomState = await redis.hgetall(`match:${roomName}`);
      console.log("roomState", roomState);
      let participants = [];
      try { participants = JSON.parse(roomState.participants); } catch { participants = []; }
      io.to(roomName).emit('all participants', { participants , roomName});
     
      // io.to(roomName).emit('all participants', { participants });
      // if (!roomState.members) roomState.members = JSON.stringify([]);
      // if (!roomState.emails) roomState.emails = JSON.stringify([]);
      // if (!roomState.readyPlayers) roomState.readyPlayers = JSON.stringify([]);
      // if (!roomState.submissions) roomState.submissions = JSON.stringify([]);
      // let members = [];
      // let emails = [];
      // let readyPlayers = [];
      // try { members = JSON.parse(roomState.members); } catch { members = []; }
      // try { emails = JSON.parse(roomState.emails); } catch { emails = []; }
      // try { readyPlayers = JSON.parse(roomState.readyPlayers); } catch { readyPlayers = []; }
      // if (!members.includes(socketId)) members.push(socketId);
      // if (!emails.includes(email)) emails.push(email);
      // await redis.hset(`room:${roomName}`, 'members', JSON.stringify(members));
      // await redis.hset(`room:${roomName}`, 'emails', JSON.stringify(emails));
      // await redis.hset(`room:${roomName}`, 'readyPlayers', JSON.stringify(readyPlayers));
      // io.to(roomName).emit('all participants', { participants  });
    });

    // SUBMIT RESULT
    socket.on('submitResult', async ({ roomName, speed, accuracy, email }) => {
      console.log(`[SOCKET] submitResult for roomName: ${roomName}`);
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
    socket.on('playerReady', async ({ roomName, isReady }) => {
      console.log(`[SOCKET] playerReady for roomName: ${roomName}`);
      if (!roomName) return;
      let roomState = await redis.hgetall(`match:${roomName}`);
      if (!roomState.members) return;
      let members = [];
      let readyPlayers = [];
      try { members = JSON.parse(roomState.members); } catch { members = []; }
      try { readyPlayers = JSON.parse(roomState.readyPlayers); } catch { readyPlayers = []; }
      if (isReady) {
        if (!readyPlayers.includes(socket.id)) readyPlayers.push(socket.id);
      } else {
        readyPlayers = readyPlayers.filter(id => id !== socket.id);
      }
      await redis.hset(`match:${roomName}`, 'readyPlayers', JSON.stringify(readyPlayers));
      io.to(roomName).emit('showReadyPlayers', readyPlayers);
      if (readyPlayers.length === members.length) {
        io.to(roomName).emit('startMatch');
      }
    });

    // DISCONNECT
    socket.on('disconnect', async () => {
      // Iterate all rooms in Redis and remove this socket.id
      for (let [key, entry] of redis.store.entries()) {
        if (key.startsWith('match:')) {
          let roomState = entry.value;
          let members = [];
          let readyPlayers = [];
          let emails = [];
          try { members = JSON.parse(roomState.members || '[]'); } catch { members = []; }
          try { readyPlayers = JSON.parse(roomState.readyPlayers || '[]'); } catch { readyPlayers = []; }
          try { emails = JSON.parse(roomState.emails || '[]'); } catch { emails = []; }
          const origMembersLen = members.length;
          members = members.filter(id => id !== socket.id);
          readyPlayers = readyPlayers.filter(id => id !== socket.id);
          // Optionally, remove email if you track which socket.id belongs to which email
          if (members.length !== origMembersLen) {
            await redis.hset(key, 'members', JSON.stringify(members));
            await redis.hset(key, 'readyPlayers', JSON.stringify(readyPlayers));
            await redis.hset(key, 'emails', JSON.stringify(emails));
            io.to(key.replace('match:', '')).emit('showReadyPlayers', readyPlayers);
            if (members.length === 0) {
              redis.store.delete(key);
            }
          }
        }
      }
      console.log('User disconnected:', socket.id);
    });

    // CREATE GROUP TO JOIN (legacy, for completeness)
    socket.on('createGroupToJoin', async ({ roomName, userName }) => {
      console.log(`[SOCKET] createGroupToJoin for roomName: ${roomName}`);
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
      console.log(`[SOCKET] startGame for roomName: ${roomName}`);
      io.in(roomName).emit('gameStarted', { message: 'The game has started!' });
    });

    // GAME OVER
    socket.on('gameOver', async (roomName) => {
      console.log(`[SOCKET] gameOver for roomName: ${roomName}`);
      io.in(roomName).emit('gameOver', { message: 'Game Over!' });
    });

    // LEAVE ROOM
    socket.on('leave room', async (roomName, email) => {
      if (!roomName || !email) return;
      let roomState = await redis.hgetall(`match:${roomName}`);
      let participants = [];
      try { participants = JSON.parse(roomState.participants || '[]'); } catch { participants = []; }
      // Remove the participant with the given email
      const newParticipants = participants.filter(p => p.email !== email);
      await redis.hset(`match:${roomName}`, 'participants', JSON.stringify(newParticipants));
      io.to(roomName).emit('all participants', { participants: newParticipants });
    });
  });
}

module.exports = initSocket; 