const { Meme, Tag, Like } = require("../models");

class MemeController {
  static async getAllMemes(req, res, next) {
    try {
      const memes = await Meme.findAll({
        include: {
          model: Tag,
          attributes: ["id", "name"],
        },
      });
      res.status(200).json(memes);
    } catch (err) {
      next(err);
    }
  }

  static async getMemeById(req, res, next) {
    try {
      const { id } = req.params;
      const meme = await Meme.findByPk(id, {
        include: {
          model: Tag,
          attributes: ["id", "name"],
        },
      });
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
          attributes: ["id", "title", "imageUrl"],
        },
      });

      if (!foundTag) {
        throw { name: "NotFound", message: "Tag not found" };
      }

      res.status(200).json(foundTag.Memes);
    } catch (error) {
      next(error);
    }
  }

  static async createMeme(req, res, next) {
    try {
      const { title, imageUrl, tags } = req.body;
      const { id: userId } = req.user;

      const meme = await Meme.create({
        title,
        imageUrl,
        userId,
      });

      if (tags && tags.length > 0) {
        const tagNames = tags.split(",").map((tag) => tag.trim());

        const tagsInstances = await Promise.all(
          tagNames.map(async (name) => {
            const [tag, created] = await Tag.findOrCreate({
              where: { name },
            });
            return tag;
          })
        );

        await meme.setTags(tagsInstances);
      }

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
      });

      if (tags && tags.length > 0) {
        const tagNames = tags.split(",").map((tag) => tag.trim());

        const tagsInstances = await Promise.all(
          tagNames.map(async (name) => {
            const [tag, created] = await Tag.findOrCreate({
              where: { name },
            });
            return tag;
          })
        );

        await meme.setTags(tagsInstances);
      }

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
      await Like.destroy({ where: { memeId: id } });

      await meme.destroy();

      res.status(200).json({ message: "Meme deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MemeController;
