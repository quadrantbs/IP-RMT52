"use strict";
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Username must be unique",
        },
        validate: {
          notEmpty: {
            msg: "Username cannot be empty",
          },
          len: {
            args: [3, 50],
            msg: "Username must be between 3 and 50 characters long",
          },
          notNull: {
            msg: "Username is required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email must be unique",
        },
        validate: {
          notEmpty: {
            msg: "Email cannot be empty",
          },
          isEmail: {
            msg: "Must be a valid email address",
          },
          notNull: {
            msg: "Email is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password cannot be empty",
          },
          len: {
            args: [6, 100],
            msg: "Password must be between 6 and 100 characters long",
          },
          notNull: {
            msg: "Password is required",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          notEmpty: {
            msg: "Role cannot be empty",
          },
          isIn: {
            args: [["admin", "user"]],
            msg: "Role must be either admin or user",
          },
          notNull: {
            msg: "Role is required",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Meme, { foreignKey: "userId" });
    User.hasMany(models.Comment, { foreignKey: "userId" });
    User.belongsToMany(models.Meme, {
      through: models.Like,
      foreignKey: "userId",
      otherKey: "memeId",
    });
  };

  return User;
};
