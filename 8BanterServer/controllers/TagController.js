const { Tag } = require("../models");

class TagController {
  static async getAllTags(req, res, next) {
    try {
      const tags = await Tag.findAll();
      res.status(200).json(tags);
    } catch (err) {
      next(err);
    }
  }

  static async createTag(req, res, next) {
    try {
      const { name } = req.body;
      const tag = await Tag.create({ name });
      res.status(201).json(tag);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TagController;
