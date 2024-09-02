const express = require('express');
const router = express.Router({ mergeParams: true });
const LikeController = require('../controllers/LikeController');

router.post('/', LikeController.addLike);

router.delete('/', LikeController.removeLike);

module.exports = router;