const request = require("supertest");
const app = require("../app");
const { Tag, sequelize } = require("../models");
const { queryInterface } = sequelize;

afterAll(async () => {
  await Tag.destroy({
    where: {},
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("Tag API", () => {
  describe("GET /tags - Get All Tags", () => {
    test("should return an empty array when no tags exist", async () => {
      const response = await request(app).get("/tags");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test("should return all tags", async () => {
      await Tag.create({ name: "funny" });
      await Tag.create({ name: "meme" });

      const response = await request(app).get("/tags");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty("name", "funny");
      expect(response.body[1]).toHaveProperty("name", "meme");
    });
  });

  describe("POST /tags - Create a New Tag", () => {
    test("should create a new tag", async () => {
      const response = await request(app)
        .post("/tags")
        .send({ name: "newtag" });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "newtag");
    });

    test("should return error if tag name is empty", async () => {
      const response = await request(app).post("/tags").send({ name: "" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Tag name cannot be empty, Tag name must be between 1 and 20 characters long"
      );
    });

    test("should return error if tag name already exists", async () => {
      await Tag.create({ name: "uniqueTag" });

      const response = await request(app)
        .post("/tags")
        .send({ name: "uniqueTag" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Tag name must be unique");
    });

    test("should return error if tag name length is more than 20 characters", async () => {
      const response = await request(app)
        .post("/tags")
        .send({ name: "a".repeat(21) });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Tag name must be between 1 and 20 characters long"
      );
    });
  });
});
