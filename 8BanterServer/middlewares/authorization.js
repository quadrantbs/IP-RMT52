const { Meme, User, Comment } = require("../models");

const authorize =
  (model, idField = "id") =>
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (req.user.role === "admin") {
        return next();
      }

      const resource = await model.findByPk(id);

      if (resource.userId !== userId) {
        throw {
          name: "Forbidden",
          message: "You are not authorized to access this resource",
        };
      }

      next();
    } catch (err) {
      next(err);
    }
  };

const authorizeMeme = authorize(Meme);

const authorizeUser = authorize(User);

const authorizeComment = authorize(Comment);

module.exports = { authorizeMeme, authorizeUser, authorizeComment };
