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

describe("Notifications API", () => {
  let token;

  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "nurlybek@test.com",
      password: "123456",
    });

    expect(loginResponse.statusCode).toBe(200);

    token = loginResponse.body.token;
  });

  test("GET /api/notifications should return notifications", async () => {
    const response = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("notifications");

    expect(Array.isArray(response.body.notifications)).toBe(true);
  });

  test("GET /api/notifications/unread-count should return unread count", async () => {
    const response = await request(app)
      .get("/api/notifications/unread-count")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("unreadCount");

    expect(typeof response.body.unreadCount).toBe("number");
  });

  test("PATCH /api/notifications/read-all should mark all notifications as read", async () => {
    const response = await request(app)
      .patch("/api/notifications/read-all")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("count");
  });

  test("GET /api/notifications should reject request without token", async () => {
    const response = await request(app).get("/api/notifications");

    expect(response.statusCode).toBe(401);

    expect(response.body).toHaveProperty("error");
  });
});

afterAll(async () => {
  await cleanupTestResources();
});
