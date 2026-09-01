const request = require("supertest");

const app = require("../src/app");

describe("Auth API", () => {
  test("POST /api/auth/login should login user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nurlybek@test.com",
        password: "123456",
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");

    expect(response.body.user.email).toBe(
      "nurlybek@test.com",
    );
  });

  test("POST /api/auth/login should reject wrong password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nurlybek@test.com",
        password: "wrong-password",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});