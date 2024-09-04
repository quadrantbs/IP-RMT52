const express = require("express");
const router = express.Router({ mergeParams: true });
const LikeController = require("../controllers/LikeController");
const authenticate = require("../middlewares/authenticate");

router.post("/", authenticate, LikeController.addLike);

router.delete("/", authenticate, LikeController.removeLike);

router.get("/status", authenticate, LikeController.checkLikeStatus);

module.exports = router;
