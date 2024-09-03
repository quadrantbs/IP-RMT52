const express = require("express");
const router = express.Router();
const LikeController = require("../controllers/LikeController");
const authenticate = require("../middlewares/authenticate");

router.post('/', authenticate, LikeController.addLike);

router.delete('/', authenticate, LikeController.removeLike);

module.exports = router;
