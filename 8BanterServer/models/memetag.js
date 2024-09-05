'use strict';
module.exports = (sequelize, DataTypes) => {
  const MemeTag = sequelize.define('MemeTag', {
    memeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Memes',
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });

  MemeTag.associate = function(models) {
    // Association with Meme model
    MemeTag.belongsTo(models.Meme, { foreignKey: 'memeId' });

    // Association with Tag model
    MemeTag.belongsTo(models.Tag, { foreignKey: 'tagId' });
  };

  return MemeTag;
};
