const request = require("supertest");

const app = require("../src/app");
const { cleanupTestResources } = require("./helpers/cleanup.helper");

const { loginUser } = require("./helpers/auth.helper");

describe("Users API", () => {
  let token;

  beforeAll(async () => {
    const result = await loginUser("nurlybek@test.com");

    token = result.token;
  });

  test("GET /api/users/me should return current user", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("user");

    expect(response.body.user).toHaveProperty("id");

    expect(response.body.user).toHaveProperty("email", "nurlybek@test.com");

    expect(response.body.user).toHaveProperty("username", "nurlibek06");

    expect(response.body.user).not.toHaveProperty("password");
  });

  test("GET /api/users/me should reject request without token", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.statusCode).toBe(401);

    expect(response.body).toHaveProperty("error");
  });

  test("GET /api/users/search should search users", async () => {
    const response = await request(app)
      .get("/api/users/search")
      .query({
        q: "bekzat",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("users");

    expect(Array.isArray(response.body.users)).toBe(true);

    const bekzat = response.body.users.find(
      (user) => user.username === "bekzat",
    );

    expect(bekzat).toBeDefined();

    expect(bekzat).toHaveProperty("username", "bekzat");

    expect(bekzat).not.toHaveProperty("password");
  });
});

afterAll(async () => {
  await cleanupTestResources();
});
