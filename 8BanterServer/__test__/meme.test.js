const request = require("supertest");
const app = require("../app");
const { Meme, User, Tag } = require("../models");

describe("Meme API", () => {
  let token;
  let userId;
  let memeId;
  let tagId;

  beforeAll(async () => {
    const user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
      role: "user",
    });
    userId = user.id;

    const response = await request(app).post("/users/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    token = response.body.token;

    const tag = await Tag.create({ name: "funny" });
    tagId = tag.id;

    const meme = await Meme.create({
      userId: user.id,
      title: "A Funny Meme",
      imageUrl: "http://example.com/funny-meme.jpg",
      tags: ["funny"],
    });
    await meme.addTag(tag);
  });

  afterAll(async () => {
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
    await Tag.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  test("GET /memes - should get all memes", async () => {
    const response = await request(app).get("/memes");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /memes - should create a new meme", async () => {
    const response = await request(app)
      .post("/memes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Meme",
        imageUrl: "http://example.com/image.png",
        tags: [tagId],
        userId,
      });

    memeId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "Test Meme");
  });

  test("GET /memes/:id - should get a meme by ID", async () => {
    const response = await request(app).get(`/memes/${memeId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", memeId);
  });

  test("GET /memes/tag/:tag - should get memes by tag", async () => {
    const response = await request(app).get("/memes/tag/funny");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("PUT /memes/:id - should update a meme", async () => {
    const response = await request(app)
      .put(`/memes/${memeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Meme",
        imageUrl: "http://example.com/updated_image.png",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Meme");
  });

  test("DELETE /memes/:id - should delete a meme", async () => {
    const response = await request(app)
      .delete(`/memes/${memeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Meme deleted successfully"
    );
  });

  test("GET /memes/:id - should return error if meme not found", async () => {
    const response = await request(app).get("/memes/9999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Meme not found");
  });

  test("POST /memes - should return error if input is invalid", async () => {
    const response = await request(app)
      .post("/memes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        imageUrl: "",
        tags: "",
        userId: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "User ID cannot be empty, User ID must be an integer, Title cannot be empty, Title must be between 3 and 50 characters long, Image URL cannot be empty, Must be a valid URL"
    );
  });
});
