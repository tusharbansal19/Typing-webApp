const socketIo = require('socket.io');

function initSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const rooms = {};

  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    socket.on('joinRoom', ({ roomName, socketId, email }) => {
      socket.join(roomName);
      if (!rooms[roomName]) {
        rooms[roomName] = { members: [], readyPlayers: [], emails: [] };
      }
      rooms[roomName].members.push(socketId);
      rooms[roomName].emails.push(email);
      io.to(roomName).emit('addNewMember', {
        members: rooms[roomName].members,
        emails: rooms[roomName].emails,
        readyPlayersList: rooms[roomName].readyPlayers,
      });
    });

    socket.on('submitResult', ({ roomName, speed, accuracy, email }) => {
      if (!rooms[roomName]) return;
      if (!rooms[roomName].submissions) rooms[roomName].submissions = [];
      rooms[roomName].submissions.push({ id: socket.id, speed, accuracy, email });
      if (rooms[roomName].submissions.length === rooms[roomName].members.length) {
        const rankedPlayers = rooms[roomName].submissions
          .sort((a, b) => b.speed - a.speed || b.accuracy - a.accuracy)
          .map((player, index) => ({ ...player, rank: index + 1 }));
        io.to(roomName).emit('showRanks', rankedPlayers);
        rooms[roomName].readyPlayers = [];
        rooms[roomName].submissions = [];
      }
    });

    socket.on('playerReady', ({ roomName, isReady }) => {
      if (!rooms[roomName]) return;
      if (isReady) {
        if (!rooms[roomName].readyPlayers.includes(socket.id)) {
          rooms[roomName].readyPlayers.push(socket.id);
        }
      } else {
        rooms[roomName].readyPlayers = rooms[roomName].readyPlayers.filter(
          (id) => id !== socket.id
        );
      }
      io.to(roomName).emit('showReadyPlayers', rooms[roomName].readyPlayers);
      if (rooms[roomName].readyPlayers.length === rooms[roomName].members.length) {
        io.to(roomName).emit('startMatch');
      }
    });

    socket.on('disconnect', () => {
      for (const roomName in rooms) {
        if (rooms[roomName]) {
          rooms[roomName].members = rooms[roomName].members.filter(
            (id) => id !== socket.id
          );
          rooms[roomName].readyPlayers = rooms[roomName].readyPlayers.filter(
            (id) => id !== socket.id
          );
          io.to(roomName).emit('showReadyPlayers', rooms[roomName].readyPlayers);
          if (rooms[roomName].members.length === 0) {
            delete rooms[roomName];
          }
        }
      }
      console.log('User disconnected:', socket.id);
    });

    socket.on('createGroupToJoin', ({ roomName, userName }) => {
      socket.join(roomName);
      if (!rooms[roomName]) rooms[roomName] = [];
      rooms[roomName].push({ id: socket.id, userName });
      io.in(roomName).emit('updateGroupMembers', rooms[roomName]);
    });

    socket.on('startGame', (roomName) => {
      io.in(roomName).emit('gameStarted', { message: 'The game has started!' });
    });

    socket.on('gameOver', (roomName) => {
      io.in(roomName).emit('gameOver', { message: 'Game Over!' });
    });
  });
}

module.exports = initSocket; 