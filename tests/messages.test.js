jest.mock("../src/config/socket", () => ({
  getIO: jest.fn(() => ({
    to: jest.fn(() => ({
      emit: jest.fn(),
    })),
  })),

  initializeSocket: jest.fn(),
}));

const request = require("supertest");

const app = require("../src/app");
const { cleanupTestResources } = require("./helpers/cleanup.helper");

describe("Messages API", () => {
  let token;
  let chatId;
  let messageId;

  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "nurlybek@test.com",
      password: "123456",
    });

    expect(loginResponse.statusCode).toBe(200);

    token = loginResponse.body.token;

    const chatsResponse = await request(app)
      .get("/api/chats")
      .set("Authorization", `Bearer ${token}`);

    expect(chatsResponse.statusCode).toBe(200);

    const chat = chatsResponse.body.chats.find((chat) => chat.isGroup === true);

    expect(chat).toBeDefined();

    chatId = chat.id;
  });

  test("POST /api/chats/:chatId/messages should send message", async () => {
    const response = await request(app)
      .post(`/api/chats/${chatId}/messages`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Jest automatic test message",
      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toHaveProperty("message");

    expect(response.body.message).toHaveProperty("id");

    expect(response.body.message).toHaveProperty(
      "content",
      "Jest automatic test message",
    );

    messageId = response.body.message.id;
  });

  test("GET /api/chats/:chatId/messages should return message history", async () => {
    const response = await request(app)
      .get(`/api/chats/${chatId}/messages`)
      .query({
        page: 1,
        limit: 20,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("messages");

    expect(Array.isArray(response.body.messages)).toBe(true);

    expect(response.body).toHaveProperty("pagination");
  });

  test("GET /api/chats/:chatId/messages should support search", async () => {
    const response = await request(app)
      .get(`/api/chats/${chatId}/messages`)
      .query({
        search: "Jest automatic",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    const found = response.body.messages.find(
      (message) => message.content === "Jest automatic test message",
    );

    expect(found).toBeDefined();
  });

  test("PATCH /api/chats/messages/:messageId should edit message", async () => {
    const response = await request(app)
      .patch(`/api/chats/messages/${messageId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Jest automatic edited message",
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("message");

    expect(response.body.message).toHaveProperty(
      "content",
      "Jest automatic edited message",
    );
  });

  test("DELETE /api/chats/messages/:messageId should delete message", async () => {
    const response = await request(app)
      .delete(`/api/chats/messages/${messageId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  test("GET messages should reject request without token", async () => {
    const response = await request(app).get(`/api/chats/${chatId}/messages`);

    expect(response.statusCode).toBe(401);

    expect(response.body).toHaveProperty("error");
  });
});

afterAll(async () => {
  await cleanupTestResources();
});
