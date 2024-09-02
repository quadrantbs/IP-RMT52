'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    memeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Meme ID cannot be empty'
        },
        isInt: {
          msg: 'Meme ID must be an integer'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'User ID cannot be empty'
        },
        isInt: {
          msg: 'User ID must be an integer'
        }
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Comment text cannot be empty'
        },
        len: {
          args: [1, 100],
          msg: 'Comment text must be between 1 and 100 characters long'
        }
      }
    }
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.Meme, { foreignKey: 'memeId' });
    Comment.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return Comment;
};
