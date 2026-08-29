const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication token is required'));
      }

      const decoded = verifyToken(token);

      socket.user = {
        userId: decoded.userId,
      };

      next();
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user.userId}`);

    socket.join(`user:${socket.user.userId}`);

    socket.on('join-chat', (chatId) => {
      socket.join(`chat:${chatId}`);

      console.log(
        `User ${socket.user.userId} joined chat ${chatId}`
      );
    });

    socket.on('leave-chat', (chatId) => {
      socket.leave(`chat:${chatId}`);
    });

    socket.on('typing-start', (chatId) => {
      socket.to(`chat:${chatId}`).emit('typing-start', {
        chatId,
        userId: socket.user.userId,
      });
    });

    socket.on('typing-stop', (chatId) => {
      socket.to(`chat:${chatId}`).emit('typing-stop', {
        chatId,
        userId: socket.user.userId,
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.user.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};