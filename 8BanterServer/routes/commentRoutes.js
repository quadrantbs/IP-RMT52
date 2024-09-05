const express = require("express");
const router = express.Router({ mergeParams: true });
const CommentController = require("../controllers/CommentController");
const authenticate = require("../middlewares/authenticate");
const { authorizeComment } = require("../middlewares/authorization");

router.post('/', authenticate, CommentController.addComment);

router.get('/', CommentController.getCommentsByMemeId);

router.delete('/:commentId', authenticate, authorizeComment, CommentController.deleteComment);

module.exports = router;
