const axios = require("axios");

class TemplateController {
  static async getMemeTemplates(req, res, next) {
    try {
      const response = await axios.get("https://api.memegen.link/templates");
      const templates = response.data;
      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TemplateController;
