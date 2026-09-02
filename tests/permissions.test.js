const request = require("supertest");

const app = require("../src/app");
const { cleanupTestResources } = require("./helpers/cleanup.helper");
const { loginUser } = require("./helpers/auth.helper");

const { findUser, findGroup } = require("./helpers/test-data.helper");

describe("Group Permissions API", () => {
  let nurToken;
  let bekzatToken;

  let groupId;
  let diasId;

  beforeAll(async () => {
    const nurLogin = await loginUser("nurlybek@test.com");

    nurToken = nurLogin.token;

    const bekzatLogin = await loginUser("sarsenbekulynurlybek06@gmail.com");

    bekzatToken = bekzatLogin.token;

    const group = await findGroup(nurToken, "Backend Developers");

    groupId = group.id;

    const dias = await findUser(nurToken, "dias");

    diasId = dias.id;
  });

  test("ADMIN should be able to rename group", async () => {
    const response = await request(app)
      .patch(`/api/chats/${groupId}`)
      .set("Authorization", `Bearer ${nurToken}`)
      .send({
        name: "Backend Developers",
      });

    expect(response.statusCode).toBe(200);
  });

  test("MEMBER should not be able to rename group", async () => {
    const response = await request(app)
      .patch(`/api/chats/${groupId}`)
      .set("Authorization", `Bearer ${bekzatToken}`)
      .send({
        name: "Hacked Group",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toHaveProperty("error");
  });

  test("MEMBER should not be able to change member role", async () => {
    const response = await request(app)
      .patch(`/api/chats/${groupId}/members/${diasId}/role`)
      .set("Authorization", `Bearer ${bekzatToken}`)
      .send({
        role: "MEMBER",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toHaveProperty("error");
  });

  test("ADMIN should be able to update another member role", async () => {
    const response = await request(app)
      .patch(`/api/chats/${groupId}/members/${diasId}/role`)
      .set("Authorization", `Bearer ${nurToken}`)
      .send({
        role: "ADMIN",
      });

    expect(response.statusCode).toBe(200);
  });

  test("ADMIN should not be able to change own role", async () => {
    const membersResponse = await request(app)
      .get(`/api/chats/${groupId}/members`)
      .set("Authorization", `Bearer ${nurToken}`);

    expect(membersResponse.statusCode).toBe(200);

    const members = membersResponse.body.members;

    const nurlibekMember = members.find(
      (member) => member.user.username === "nurlibek06",
    );

    expect(nurlibekMember).toBeDefined();

    const response = await request(app)
      .patch(`/api/chats/${groupId}/members/${nurlibekMember.userId}/role`)
      .set("Authorization", `Bearer ${nurToken}`)
      .send({
        role: "MEMBER",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toHaveProperty("error");
  });
});

afterAll(async () => {
  await cleanupTestResources();
});
