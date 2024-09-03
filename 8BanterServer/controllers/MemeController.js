const { Meme, Tag } = require("../models");

class MemeController {
  static async getAllMemes(req, res, next) {
    try {
      const memes = await Meme.findAll();
      res.status(200).json(memes);
    } catch (err) {
      next(err);
    }
  }

  static async getMemeById(req, res, next) {
    try {
      const { id } = req.params;
      const meme = await Meme.findByPk(id);
      if (!meme) {
        throw { name: "NotFound", message: "Meme not found" };
      }
      res.status(200).json(meme);
    } catch (err) {
      next(err);
    }
  }
  static async getMemesByTag(req, res, next) {
    try {
      const { tag } = req.params;

      const foundTag = await Tag.findOne({
        where: { name: tag },
        include: {
          model: Meme,
          through: { attributes: [] },
        },
      });

      if (!foundTag) {
        return res.status(404).json({ message: "Tag not found" });
      }

      const memes = foundTag.Memes;

      res.status(200).json(memes);
    } catch (error) {
      next(error);
    }
  }

  static async createMeme(req, res, next) {
    try {
      const { title, imageUrl, tags, userId } = req.body;

      const meme = await Meme.create({
        title,
        imageUrl,
        tags,
        userId,
      });

      res.status(201).json(meme);
    } catch (err) {
      next(err);
    }
  }

  static async updateMeme(req, res, next) {
    try {
      const { id } = req.params;
      const { title, imageUrl, tags } = req.body;

      const meme = await Meme.findByPk(id);
      if (!meme) {
        throw { name: "NotFound", message: "Meme not found" };
      }

      await meme.update({
        title,
        imageUrl,
        tags,
      });

      res.status(200).json(meme);
    } catch (err) {
      next(err);
    }
  }

  static async deleteMeme(req, res, next) {
    try {
      const { id } = req.params;
      const meme = await Meme.findByPk(id);
      if (!meme) {
        throw { name: "NotFound", message: "Meme not found" };
      }

      await meme.destroy();

      res.status(200).json({ message: "Meme deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MemeController;
