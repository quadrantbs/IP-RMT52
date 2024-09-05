'use strict';
module.exports = (sequelize, DataTypes) => {
  const Meme = sequelize.define('Meme', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty'
        },
        len: {
          args: [3, 50],
          msg: 'Title must be between 3 and 50 characters long'
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Image URL cannot be empty'
        },
        isUrl: {
          msg: 'Must be a valid URL'
        }
      }
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Likes must be an integer'
        }
      }
    }
  }, {});
  Meme.associate = function(models) {
    Meme.belongsTo(models.User, { foreignKey: 'userId' });
    Meme.hasMany(models.Comment, { foreignKey: 'memeId' });
    Meme.belongsToMany(models.Tag, {
      through: models.MemeTag,
      foreignKey: 'memeId',
      otherKey: 'tagId'
    });
    Meme.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'memeId',
      otherKey: 'userId'
    });
  };
  return Meme;
};
