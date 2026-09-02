const request = require("supertest");

const app = require("../src/app");
const { cleanupTestResources } = require("./helpers/cleanup.helper");

describe("Chats API", () => {
  let token;
  let bekzatId;

  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "nurlybek@test.com",
      password: "123456",
    });

    expect(loginResponse.statusCode).toBe(200);

    token = loginResponse.body.token;

    const searchResponse = await request(app)
      .get("/api/users/search")
      .query({
        q: "bekzat",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(searchResponse.statusCode).toBe(200);

    const bekzat = searchResponse.body.users.find(
      (user) => user.username === "bekzat",
    );

    expect(bekzat).toBeDefined();

    bekzatId = bekzat.id;
  });

  test("GET /api/chats should return current user's chats", async () => {
    const response = await request(app)
      .get("/api/chats")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("chats");

    expect(Array.isArray(response.body.chats)).toBe(true);
  });

  test("POST /api/chats/private should create or return private chat", async () => {
    const response = await request(app)
      .post("/api/chats/private")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: bekzatId,
      });

    expect([200, 201]).toContain(response.statusCode);

    expect(response.body).toHaveProperty("chat");

    expect(response.body.chat).toHaveProperty("id");

    expect(response.body.chat).toHaveProperty("isGroup", false);
  });

  test("GET /api/chats should reject request without token", async () => {
    const response = await request(app).get("/api/chats");

    expect(response.statusCode).toBe(401);

    expect(response.body).toHaveProperty("error");
  });
});

afterAll(async () => {
  await cleanupTestResources();
});
