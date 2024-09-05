const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  await User.sync({ force: true });

  await User.create({
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
    role: "user",
  });

  await User.create({
    username: "adminuser",
    email: "admin@example.com",
    password: "adminpassword",
    role: "admin",
  });
});

afterAll(async () => {
  await User.destroy({
    where: {},
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("User API", () => {
  describe("POST /users/register", () => {
    test("should register a new user", async () => {
      const response = await request(app).post("/users/register").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "newpassword",
        role: "user",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("username", "newuser");
      expect(response.body).toHaveProperty("email", "newuser@example.com");
      expect(response.body).not.toHaveProperty("password");
    });

    test("should return error if registration data is invalid", async () => {
      const response = await request(app).post("/users/register").send({
        username: "",
        email: "invalidemail",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
    test("should hash password before creating user", async () => {
      const response = await request(app).post("/users/register").send({
        username: "newuser1",
        email: "newuser1@example.com",
        password: "newpassword",
        role: "user",
      });

      expect(response.status).toBe(201);

      const user = await User.findOne({
        where: { email: "newuser1@example.com" },
      });

      expect(user.password).not.toBe("newpassword");
    });
  });

  describe("POST /users/login", () => {
    test("should login a user with valid credentials", async () => {
      const response = await request(app).post("/users/login").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    test("should return error if login credentials are invalid", async () => {
      const response = await request(app).post("/users/login").send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid email/password");
    });
  });

  describe("GET /users", () => {
    let adminToken;
    let userToken;

    beforeAll(async () => {
      // Login sebagai admin untuk mendapatkan token admin
      const adminResponse = await request(app).post("/users/login").send({
        email: "admin@example.com",
        password: "adminpassword",
      });
      adminToken = adminResponse.body.token;

      // Login sebagai user untuk mendapatkan token user
      const userResponse = await request(app).post("/users/login").send({
        email: "testuser@example.com",
        password: "password123",
      });
      userToken = userResponse.body.token;
    });

    test("should get all users if authenticated as admin", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("username");
      expect(response.body[0]).not.toHaveProperty("password");
    });

    test("should return error if not authenticated as admin", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403); // Update status code to 403 if access is denied
      expect(response.body).toHaveProperty("error", "Access denied");
    });

    test("should return error if not authenticated", async () => {
      const response = await request(app).get("/users");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid Token");
    });
  });
});
