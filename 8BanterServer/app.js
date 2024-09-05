require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandler");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "177930775716-007cdki2fsr1jvbeai7jec95tal4en3h.apps.googleusercontent.com"
);
const { User } = require("./models");
const jwt = require("jsonwebtoken");
const axios = require("axios");
// import OpenAI from "openai";
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routers
const userRoutes = require("./routes/userRoutes");
const memeRoutes = require("./routes/memeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const tagRoutes = require("./routes/tagRoutes");
const templateRoutes = require("./routes/templateRoutes");

// Use routers
app.use("/users", userRoutes);
app.use("/memes", memeRoutes);
app.use("/tags", tagRoutes);
app.use("/templates", templateRoutes);
app.use("/memes/:id/comments", commentRoutes);
app.use("/memes/:id/likes", likeRoutes);

// Get all routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to 8Banter API",
    routes: {
      memes: "/memes",
      users: "/users",
      comments: "/comments",
      likes: "/likes",
      templates: "/templates",
    },
  });
});

app.post("/auth/google", async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience:
        "177930775716-007cdki2fsr1jvbeai7jec95tal4en3h.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    const randomPassword = Math.random().toString(36).slice(-8);
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        username: name,
        password: randomPassword,
      },
    });
    if (created) {
      console.log("User made:", user);
    } else {
      console.log("User exists:", user);
    }
    const username = user.username;
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    res
      .status(200)
      .json({ message: "Google login successful", token, username });
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              text: "You are tasked with providing meme ideas using templates from memegen.link.api. Please give a maximum of 3 ideas per response. add copy markdown features for title and the texts",
              type: "text",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message,
            },
          ],
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: "text",
      },
    });
    res.json(response.choices[0].message.content);
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    res.status(500).send("An error occurred while fetching the response.");
  }
});


app.use(errorHandler);

module.exports = app;
