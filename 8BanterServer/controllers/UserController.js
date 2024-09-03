const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password, role } = req.body;
      const user = await User.create({ username, email, password, role });
      res
        .status(201)
        .json({ id: user.id, username: user.username, email: user.email });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw {
          name: "BadRequest",
          message: "Email and password are required",
        };
      }
      const user = await User.findOne({ where: { email } });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw { name: "Unauthorized", message: "Invalid email/password" };
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET
      );

      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
