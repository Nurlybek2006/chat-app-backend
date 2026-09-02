const request = require("supertest");
const app = require("../../src/app");

async function loginUser(email, password = "123456") {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password,
    });

  if (response.statusCode !== 200) {
    throw new Error(
      `Login failed for ${email}: ${JSON.stringify(
        response.body,
      )}`,
    );
  }

  return {
    token: response.body.token,
    user: response.body.user,
  };
}

module.exports = {
  loginUser,
};