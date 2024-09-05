'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    memeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Memes',
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });

  Like.associate = function(models) {
    // Association with User model
    Like.belongsTo(models.User, { foreignKey: 'userId' });

    // Association with Meme model
    Like.belongsTo(models.Meme, { foreignKey: 'memeId' });
  };

  return Like;
};
