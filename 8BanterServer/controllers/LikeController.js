const { Like, Meme, User } = require("../models");

class LikeController {
  static async addLike(req, res, next) {
    try {
      const { id: memeId } = req.params;
      const userId = req.user.id;

      const meme = await Meme.findByPk(memeId);
      if (!meme) {
        throw { name: "NotFound", message: "Meme not found" };
      }

      const existingLike = await Like.findOne({
        where: { memeId, userId },
      });
      if (existingLike) {
        throw { name: "Conflict", message: "You already liked this meme" };
      }

      const like = await Like.create({ memeId, userId });

      meme.likes += 1;
      await meme.save();

      res.status(201).json(like);
    } catch (err) {
      next(err);
    }
  }

  static async removeLike(req, res, next) {
    try {
      const { id: memeId } = req.params;
      const userId = req.user.id;

      const like = await Like.findOne({
        where: { memeId, userId },
      });
      if (!like) {
        throw { name: "NotFound", message: "Like not found" };
      }

      await like.destroy();

      const meme = await Meme.findByPk(memeId);
      if (!meme) {
        throw { name: "NotFound", message: "Meme not found" };
      }

      meme.likes = Math.max(0, meme.likes - 1);
      await meme.save();

      res.status(200).json({ message: "Like removed successfully" });
    } catch (err) {
      next(err);
    }
  }
  static async checkLikeStatus(req, res, next) {
    try {
      const { id: memeId } = req.params;
      const userId = req.user.id;

      const like = await Like.findOne({
        where: { memeId, userId },
      });

      res.status(200).json({ isLiked: !!like });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LikeController;
