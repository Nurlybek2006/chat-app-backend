const { Server } = require("socket.io");
const { verifyToken } = require("../utils/jwt");
const prisma = require("./prisma");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication token is required"));
      }

      const decoded = verifyToken(token);

      socket.user = {
        userId: decoded.userId,
      };

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  // Connection
  io.on("connection", (socket) => {
    const userId = socket.user.userId;

    console.log(`Socket connected: ${userId} | ${socket.id}`);

    // Personal room
    socket.join(`user:${userId}`);

    // =====================================================
    // JOIN CHAT
    // =====================================================

    socket.on("join-chat", async (chatId) => {
      try {
        if (!chatId) {
          socket.emit("socket-error", {
            message: "Chat ID is required",
          });

          return;
        }

        const membership = await prisma.chatMember.findUnique({
          where: {
            userId_chatId: {
              userId,
              chatId,
            },
          },
        });

        if (!membership) {
          socket.emit("socket-error", {
            message: "You are not a member of this chat",
          });

          return;
        }

        const roomName = `chat:${chatId}`;

        if (socket.rooms.has(roomName)) {
          socket.emit("joined-chat", {
            chatId,
          });

          return;
        }

        await socket.join(roomName);

        socket.emit("joined-chat", {
          chatId,
        });

        console.log(`User ${userId} joined chat ${chatId}`);
      } catch (error) {
        console.error("Join chat error:", error);

        socket.emit("socket-error", {
          message: "Failed to join chat",
        });
      }
    });

    // =====================================================
    // LEAVE CHAT
    // =====================================================

    socket.on("leave-chat", async (chatId) => {
      try {
        if (!chatId) {
          return;
        }

        await socket.leave(`chat:${chatId}`);

        socket.emit("left-chat", {
          chatId,
        });
      } catch (error) {
        console.error("Leave chat error:", error);

        socket.emit("socket-error", {
          message: "Failed to leave chat",
        });
      }
    });

    // =====================================================
    // TYPING START
    // =====================================================

    socket.on("typing-start", async (chatId) => {
      try {
        if (!chatId) {
          return;
        }

        const membership = await prisma.chatMember.findUnique({
          where: {
            userId_chatId: {
              userId,
              chatId,
            },
          },
        });

        if (!membership) {
          return;
        }

        socket.to(`chat:${chatId}`).emit("typing-start", {
          chatId,
          userId,
        });
      } catch (error) {
        console.error("Typing start error:", error);
      }
    });

    // =====================================================
    // TYPING STOP
    // =====================================================

    socket.on("typing-stop", async (chatId) => {
      try {
        if (!chatId) {
          return;
        }

        const membership = await prisma.chatMember.findUnique({
          where: {
            userId_chatId: {
              userId,
              chatId,
            },
          },
        });

        if (!membership) {
          return;
        }

        socket.to(`chat:${chatId}`).emit("typing-stop", {
          chatId,
          userId,
        });
      } catch (error) {
        console.error("Typing stop error:", error);
      }
    });

    // =====================================================
    // DISCONNECT
    // =====================================================

    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${userId} | ${socket.id}`);

      try {
        const remainingSockets = await io.in(`user:${userId}`).fetchSockets();

        if (remainingSockets.length === 0) {
          const now = new Date();

          await prisma.user.update({
            where: {
              id: userId,
            },

            data: {
              status: "OFFLINE",
              lastSeen: now,
            },
          });

          socket.broadcast.emit("user-offline", {
            userId,
            lastSeen: now,
          });
        }
      } catch (error) {
        console.error("Offline status update error:", error);
      }
    });

    // =====================================================
    // ONLINE STATUS
    // =====================================================
    //
    // Маңызды:
    // Socket event listener-лер жоғарыда БІРІНШІ тіркелді.
    // Сондықтан client connect болған бойда join-chat жіберсе де,
    // event жоғалмайды.
    //
    // Бұл async функция connection handler-ді блоктамайды.

    (async () => {
      try {
        const userSockets = await io.in(`user:${userId}`).fetchSockets();

        // First active socket
        if (userSockets.length === 1) {
          await prisma.user.update({
            where: {
              id: userId,
            },

            data: {
              status: "ONLINE",
            },
          });

          socket.broadcast.emit("user-online", {
            userId,
          });
        }
      } catch (error) {
        console.error("Online status update error:", error);
      }
    })();
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};
