const express = require('express');
const router = express.Router({ mergeParams: true });
const CommentController = require('../controllers/CommentController');

router.post('/', CommentController.addComment);

router.get('/', CommentController.getCommentsByMemeId);

router.delete('/:commentId', CommentController.deleteComment);

module.exports = router;