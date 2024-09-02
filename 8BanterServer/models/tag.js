'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Tag name must be unique'
      },
      validate: {
        notEmpty: {
          msg: 'Tag name cannot be empty'
        },
        len: {
          args: [1, 20],
          msg: 'Tag name must be between 1 and 20 characters long'
        }
      }
    }
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Meme, {
      through: models.MemeTag,
      foreignKey: 'tagId',
      otherKey: 'memeId'
    });
  };
  return Tag;
};
