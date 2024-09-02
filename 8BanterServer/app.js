const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routers
const userRoutes = require('./routes/userRoutes');
const memeRoutes = require('./routes/memeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const tagRoutes = require('./routes/tagRoutes');
const templateRoutes = require('./routes/templateRoutes');

// Use routers
app.use('/users', userRoutes);
app.use('/memes', memeRoutes);
app.use('/memes/:id/comments', commentRoutes);
app.use('/memes/:id/likes', likeRoutes);
app.use('/tags', tagRoutes);
app.use('/templates', templateRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
