require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandler");

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
    console.log(payload);
    res.status(200).json({ message: "Google login successful" });
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
});

app.use(errorHandler);

module.exports = app;
