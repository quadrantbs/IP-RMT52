const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const authenticate = require("./middlewares/authenticate");
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
app.use("/memes/:id/comments", commentRoutes);
app.use("/memes/:id/likes", likeRoutes);
app.use("/tags", tagRoutes);
app.use("/templates", templateRoutes);

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

app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
