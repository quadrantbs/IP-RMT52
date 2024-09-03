const request = require("supertest");
const app = require("../app"); // Path ke file app.js
const { User, Meme, Like } = require("../models");

describe("Like API", () => {
  let token;
  let memeId;
  let userId;

  beforeAll(async () => {
    // Setup user, meme, dan token
    const user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
      role: "user",
    });
    userId = user.id;

    const meme = await Meme.create({
      title: "Test Meme",
      imageUrl: "http://example.com/image.png",
      userId,
    });
    memeId = meme.id;

    // Login untuk mendapatkan token
    const response = await request(app).post("/users/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    token = response.body.token;
  });

  afterAll(async () => {
    // Bersihkan data setelah test selesai
    await Like.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await Meme.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await User.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  test("POST /memes/:id/likes - should add a like", async () => {
    const response = await request(app)
      .post(`/memes/${memeId}/likes`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("memeId", memeId);
    expect(response.body).toHaveProperty("userId", userId);
  });

  test("POST /memes/:id/likes - should not allow duplicate likes", async () => {
    await Like.create({ memeId, userId });

    const response = await request(app)
      .post(`/memes/${memeId}/likes`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error", "You already liked this meme");
  });

  test("DELETE /memes/:id/likes - should remove a like", async () => {
    await Like.create({ memeId, userId });

    const response = await request(app)
      .delete(`/memes/${memeId}/likes`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Like removed successfully");
  });

  test("DELETE /memes/:id/likes - should return error if like not found", async () => {
    const response = await request(app)
      .delete(`/memes/${memeId}/likes`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Like not found");
  });

  test("POST /memes/:id/likes - should return error if meme not found", async () => {
    const invalidMemeId = 9999;

    const response = await request(app)
      .post(`/memes/${invalidMemeId}/likes`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Meme not found");
  });
});
