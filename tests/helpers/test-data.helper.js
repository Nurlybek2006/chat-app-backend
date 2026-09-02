const request = require("supertest");
const app = require("../../src/app");

async function findUser(token, username) {
  const response = await request(app)
    .get("/api/users/search")
    .query({
      q: username,
    })
    .set(
      "Authorization",
      `Bearer ${token}`,
    );

  if (response.statusCode !== 200) {
    throw new Error(
      `Failed to search user: ${username}`,
    );
  }

  const user = response.body.users.find(
    (user) =>
      user.username === username,
  );

  if (!user) {
    throw new Error(
      `User not found: ${username}`,
    );
  }

  return user;
}

async function findGroup(
  token,
  groupName,
) {
  const response = await request(app)
    .get("/api/chats")
    .set(
      "Authorization",
      `Bearer ${token}`,
    );

  if (response.statusCode !== 200) {
    throw new Error(
      "Failed to get chats",
    );
  }

  const group = response.body.chats.find(
    (chat) =>
      chat.isGroup === true &&
      chat.name === groupName,
  );

  if (!group) {
    throw new Error(
      `Group not found: ${groupName}`,
    );
  }

  return group;
}

module.exports = {
  findUser,
  findGroup,
};