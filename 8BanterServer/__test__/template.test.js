const request = require("supertest");
const app = require("../app");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

let mock;

beforeAll(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});

describe("Template API", () => {
  describe("GET /templates - Get All Meme Templates", () => {
    test("should return all meme templates from external API", async () => {
      const mockTemplates = [
        {
          id: "buzz",
          name: "Buzz Lightyear",
          url: "https://api.memegen.link/images/buzz.png",
        },
        {
          id: "drake",
          name: "Drake Hotline Bling",
          url: "https://api.memegen.link/images/drake.png",
        },
      ];

      mock
        .onGet("https://api.memegen.link/templates")
        .reply(200, mockTemplates);

      const response = await request(app).get("/templates");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(mockTemplates.length);
      expect(response.body[0]).toHaveProperty("id", "buzz");
      expect(response.body[0]).toHaveProperty("name", "Buzz Lightyear");
      expect(response.body[0]).toHaveProperty(
        "url",
        "https://api.memegen.link/images/buzz.png"
      );
      expect(response.body[1]).toHaveProperty("id", "drake");
      expect(response.body[1]).toHaveProperty("name", "Drake Hotline Bling");
      expect(response.body[1]).toHaveProperty(
        "url",
        "https://api.memegen.link/images/drake.png"
      );
    });

    test("should return error when external API fails", async () => {
      mock.onGet("https://api.memegen.link/templates").reply(500);

      const response = await request(app).get("/templates");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error", "Internal Server Error");
    });
  });
});
