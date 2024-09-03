const { Comment, User, Meme } = require("../models");

class CommentController {
  static async addComment(req, res, next) {
    try {
      const { text } = req.body;

      if (!text) {
        throw { name: "BadRequest", message: "Text cannot be empty" };
      }
      const { id: memeId } = req.params;
      const userId = req.user.id;

      const meme = await Meme.findByPk(memeId);
      if (!meme) {
        throw { name: "NotFound", message: "Meme not found" };
      }

      const comment = await Comment.create({
        text,
        memeId,
        userId,
      });

      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }

  static async getCommentsByMemeId(req, res, next) {
    try {
      const { id: memeId } = req.params;
      const comments = await Comment.findAll({
        where: { memeId },
        include: [{ model: User, attributes: ["id", "username"] }],
      });

      if (comments.length === 0) {
        throw { name: "NotFound", message: "No comments found for this meme" };
      }

      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  }

  static async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        throw { name: "NotFound", message: "Comment not found" };
      }

      await comment.destroy();

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CommentController;
