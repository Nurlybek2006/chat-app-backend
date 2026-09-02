const http = require("http");

const { io: Client } = require("socket.io-client");

const app = require("../src/app");

const { initializeSocket } = require("../src/config/socket");

const { loginUser } = require("./helpers/auth.helper");

const { cleanupTestResources } = require("./helpers/cleanup.helper");

const { findGroup } = require("./helpers/test-data.helper");

const prisma = require("../src/config/prisma");

const request = require("supertest");

// =====================================================
// HELPERS
// =====================================================

function connectSocket(url, token) {
  return new Promise((resolve, reject) => {
    const socket = Client(url, {
      auth: {
        token,
      },

      transports: ["websocket"],

      reconnection: false,
    });

    const timer = setTimeout(() => {
      socket.disconnect();

      reject(new Error("Socket connection timeout"));
    }, 3000);

    socket.once("connect", () => {
      clearTimeout(timer);

      resolve(socket);
    });

    socket.once("connect_error", (error) => {
      clearTimeout(timer);

      socket.disconnect();

      reject(error);
    });
  });
}

function waitForSocketEvent(socket, eventName, action) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();

      reject(new Error(`Timeout waiting for "${eventName}"`));
    }, 3000);

    const onSuccess = (data) => {
      cleanup();

      resolve(data);
    };

    const onError = (error) => {
      cleanup();

      reject(
        new Error(`Socket error: ${error?.message || JSON.stringify(error)}`),
      );
    };

    function cleanup() {
      clearTimeout(timer);

      socket.off(eventName, onSuccess);

      socket.off("socket-error", onError);
    }

    socket.once(eventName, onSuccess);

    socket.once("socket-error", onError);

    action();
  });
}

// =====================================================
// TESTS
// =====================================================

describe("Socket.io", () => {
  let server;
  let ioServer;
  let port;

  const sockets = new Set();

  function trackSocket(socket) {
    sockets.add(socket);

    return socket;
  }

  // ===================================================
  // BEFORE ALL
  // ===================================================

  beforeAll(async () => {
    server = http.createServer(app);

    ioServer = initializeSocket(server);

    await new Promise((resolve) => {
      server.listen(0, () => {
        port = server.address().port;

        resolve();
      });
    });
  });

  // ===================================================
  // AFTER EACH
  // ===================================================

  afterEach(() => {
    for (const socket of sockets) {
      if (socket.connected) {
        socket.disconnect();
      }

      socket.removeAllListeners();
    }

    sockets.clear();
  });

  // ===================================================
  // AFTER ALL
  // ===================================================

  afterAll(async () => {
    for (const socket of sockets) {
      socket.disconnect();
      socket.removeAllListeners();
    }

    sockets.clear();

    await new Promise((resolve) => {
      ioServer.close(() => {
        resolve();
      });
    });

    await cleanupTestResources();
  });

  // ===================================================
  // VALID TOKEN
  // ===================================================

  test("should connect with valid JWT token", async () => {
    const login = await loginUser("nurlybek@test.com");

    const socket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    expect(socket.connected).toBe(true);
  });

  // ===================================================
  // NO TOKEN
  // ===================================================

  test("should reject connection without token", async () => {
    const socket = Client(`http://localhost:${port}`, {
      transports: ["websocket"],

      reconnection: false,
    });

    trackSocket(socket);

    const error = await new Promise((resolve) => {
      socket.once("connect_error", resolve);
    });

    expect(error).toBeDefined();

    expect(error.message).toBe("Authentication token is required");

    expect(socket.connected).toBe(false);
  });

  // ===================================================
  // INVALID TOKEN
  // ===================================================

  test("should reject connection with invalid JWT token", async () => {
    const socket = Client(`http://localhost:${port}`, {
      auth: {
        token: "invalid-jwt-token",
      },

      transports: ["websocket"],

      reconnection: false,
    });

    trackSocket(socket);

    const error = await new Promise((resolve) => {
      socket.once("connect_error", resolve);
    });

    expect(error).toBeDefined();

    expect(error.message).toBe("Invalid or expired token");

    expect(socket.connected).toBe(false);
  });

  // ===================================================
  // JOIN CHAT
  // ===================================================

  test("should join chat room if user is a member", async () => {
    const login = await loginUser("nurlybek@test.com");

    const group = await findGroup(login.token, "Backend Developers");

    const socket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    const joinedData = await waitForSocketEvent(socket, "joined-chat", () => {
      socket.emit("join-chat", group.id);
    });

    expect(joinedData).toEqual({
      chatId: group.id,
    });
  });

  // ===================================================
  // LEAVE CHAT
  // ===================================================

  test("should leave chat room", async () => {
    const login = await loginUser("nurlybek@test.com");

    const group = await findGroup(login.token, "Backend Developers");

    const socket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    await waitForSocketEvent(socket, "joined-chat", () => {
      socket.emit("join-chat", group.id);
    });

    const leftData = await waitForSocketEvent(socket, "left-chat", () => {
      socket.emit("leave-chat", group.id);
    });

    expect(leftData).toEqual({
      chatId: group.id,
    });
  });

  // ===================================================
  // TYPING START
  // ===================================================

  test("should broadcast typing-start to another chat member", async () => {
    const nurLogin = await loginUser("nurlybek@test.com");

    const bekzatLogin = await loginUser("sarsenbekulynurlybek06@gmail.com");

    const group = await findGroup(nurLogin.token, "Backend Developers");

    const nurSocket = trackSocket(
      await connectSocket(`http://localhost:${port}`, nurLogin.token),
    );

    const bekzatSocket = trackSocket(
      await connectSocket(`http://localhost:${port}`, bekzatLogin.token),
    );

    await waitForSocketEvent(nurSocket, "joined-chat", () => {
      nurSocket.emit("join-chat", group.id);
    });

    await waitForSocketEvent(bekzatSocket, "joined-chat", () => {
      bekzatSocket.emit("join-chat", group.id);
    });

    const typingData = await waitForSocketEvent(
      bekzatSocket,
      "typing-start",
      () => {
        nurSocket.emit("typing-start", group.id);
      },
    );

    expect(typingData).toEqual({
      chatId: group.id,

      userId: nurLogin.user.id,
    });
  });

  // ===================================================
  // TYPING STOP
  // ===================================================

  test("should broadcast typing-stop to another chat member", async () => {
    const nurLogin = await loginUser("nurlybek@test.com");

    const bekzatLogin = await loginUser("sarsenbekulynurlybek06@gmail.com");

    const group = await findGroup(nurLogin.token, "Backend Developers");

    const nurSocket = trackSocket(
      await connectSocket(`http://localhost:${port}`, nurLogin.token),
    );

    const bekzatSocket = trackSocket(
      await connectSocket(`http://localhost:${port}`, bekzatLogin.token),
    );

    await waitForSocketEvent(nurSocket, "joined-chat", () => {
      nurSocket.emit("join-chat", group.id);
    });

    await waitForSocketEvent(bekzatSocket, "joined-chat", () => {
      bekzatSocket.emit("join-chat", group.id);
    });

    const typingData = await waitForSocketEvent(
      bekzatSocket,
      "typing-stop",
      () => {
        nurSocket.emit("typing-stop", group.id);
      },
    );

    expect(typingData).toEqual({
      chatId: group.id,

      userId: nurLogin.user.id,
    });
  });

  test("should set user status to ONLINE after socket connection", async () => {
    const login = await loginUser("nurlybek@test.com");

    const socket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 150);
    });

    const user = await prisma.user.findUnique({
      where: {
        id: login.user.id,
      },
    });

    expect(user.status).toBe("ONLINE");

    socket.disconnect();
  });

  test("should set user status to OFFLINE after last socket disconnects", async () => {
    const login = await loginUser("nurlybek@test.com");

    const socket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 150);
    });

    socket.disconnect();

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    const user = await prisma.user.findUnique({
      where: {
        id: login.user.id,
      },
    });

    expect(user.status).toBe("OFFLINE");

    expect(user.lastSeen).toBeDefined();
  });

  test("should keep user ONLINE if one of multiple sockets is still connected", async () => {
    const login = await loginUser("nurlybek@test.com");

    const firstSocket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    const secondSocket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 150);
    });

    firstSocket.disconnect();

    await new Promise((resolve) => {
      setTimeout(resolve, 150);
    });

    const user = await prisma.user.findUnique({
      where: {
        id: login.user.id,
      },
    });

    expect(user.status).toBe("ONLINE");

    secondSocket.disconnect();
  });

  test("should set user OFFLINE only after all sockets disconnect", async () => {
    const login = await loginUser("nurlybek@test.com");

    const firstSocket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    const secondSocket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 150);
    });

    firstSocket.disconnect();

    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    let user = await prisma.user.findUnique({
      where: {
        id: login.user.id,
      },
    });

    expect(user.status).toBe("ONLINE");

    secondSocket.disconnect();

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    user = await prisma.user.findUnique({
      where: {
        id: login.user.id,
      },
    });

    expect(user.status).toBe("OFFLINE");

    expect(user.lastSeen).toBeDefined();
  });

  test("should return socket-error when chatId is missing", async () => {
    const login = await loginUser("nurlybek@test.com");

    const socket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    const errorData = await waitForSocketEvent(socket, "socket-error", () => {
      socket.emit("join-chat");
    });

    expect(errorData).toEqual({
      message: "Chat ID is required",
    });
  });

  test("should reject join-chat if user is not a member", async () => {
    const diasLogin = await loginUser("dias@test.com");

    const privateChatResponse = await request(app)
      .post("/api/chats/private")
      .set("Authorization", `Bearer ${diasLogin.token}`)
      .send({
        userId: (await loginUser("sarsenbekulynurlybek06@gmail.com")).user.id,
      });

    expect(privateChatResponse.statusCode).toBe(201);

    const privateChat =
      privateChatResponse.body.chat || privateChatResponse.body;

    const nurLogin = await loginUser("nurlybek@test.com");

    const socket = trackSocket(
      await connectSocket(`http://localhost:${port}`, nurLogin.token),
    );

    const errorData = await waitForSocketEvent(socket, "socket-error", () => {
      socket.emit("join-chat", privateChat.id);
    });

    expect(errorData).toEqual({
      message: "You are not a member of this chat",
    });
  });

  test("should allow joining the same chat more than once without error", async () => {
    const login = await loginUser("nurlybek@test.com");

    const group = await findGroup(login.token, "Backend Developers");

    const socket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    const firstJoin = await waitForSocketEvent(socket, "joined-chat", () => {
      socket.emit("join-chat", group.id);
    });

    expect(firstJoin).toEqual({
      chatId: group.id,
    });

    const secondJoin = await waitForSocketEvent(socket, "joined-chat", () => {
      socket.emit("join-chat", group.id);
    });

    expect(secondJoin).toEqual({
      chatId: group.id,
    });
  });

  test("should ignore leave-chat without chatId", async () => {
    const login = await loginUser("nurlybek@test.com");

    const socket = trackSocket(
      await connectSocket(`http://localhost:${port}`, login.token),
    );

    socket.emit("leave-chat");

    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(socket.connected).toBe(true);
  });
});
