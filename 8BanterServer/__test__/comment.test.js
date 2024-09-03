const request = require("supertest");
const app = require("../app");
const { User, Meme, Comment } = require("../models");

describe("Comment API", () => {
  let token;
  let memeId;
  let userId;

  beforeAll(async () => {
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

    const response = await request(app).post("/users/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    token = response.body.token;
  });

  afterAll(async () => {
    await Comment.destroy({
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

  test("POST /memes/:id/comments - should add a comment", async () => {
    const response = await request(app)
      .post(`/memes/${memeId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "This is a test comment",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("text", "This is a test comment");
    expect(response.body).toHaveProperty("memeId", memeId);
    expect(response.body).toHaveProperty("userId", userId);
  });

  test("GET /memes/:id/comments - should get comments for a meme", async () => {
    await Comment.create({
      text: "Another test comment",
      memeId,
      userId,
    });

    const response = await request(app).get(`/memes/${memeId}/comments`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("DELETE /memes/:id/comments/:commentId - should delete a comment", async () => {
    const comment = await Comment.create({
      text: "Comment to be deleted",
      memeId,
      userId,
    });

    const response = await request(app)
      .delete(`/memes/${memeId}/comments/${comment.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Comment deleted successfully"
    );
  });

  test("POST /memes/:id/comments - should return 404 if meme does not exist", async () => {
    const invalidMemeId = 9999;
    const response = await request(app)
      .post(`/memes/${invalidMemeId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "This comment should fail",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Meme not found");
  });

  test("DELETE /memes/:id/comments/:commentId - should return 404 if comment does not exist", async () => {
    const invalidCommentId = 9999;
    const response = await request(app)
      .delete(`/memes/${memeId}/comments/${invalidCommentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Comment not found");
  });

  test("POST /memes/:id/comments - should return 401 if no token provided", async () => {
    const response = await request(app).post(`/memes/${memeId}/comments`).send({
      text: "This comment should fail due to no token",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid Token");
  });

  test("POST /memes/:id/comments - should return 400 if text is missing", async () => {
    const response = await request(app)
      .post(`/memes/${memeId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Comment cannot be empty");
  });
});
