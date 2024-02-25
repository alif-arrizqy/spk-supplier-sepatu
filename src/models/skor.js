'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Skor extends Model {
    static associate(models) {
      Skor.belongsTo(models.user, { foreignKey: 'user_id', as: 'user' });
      Skor.belongsTo(models.alternatif, { foreignKey: 'alternatif_id', as: 'alternatif' });
      Skor.belongsTo(models.nilai_target, { foreignKey: 'nilai_target_id', as: 'nilai_target' });
    }

    static async getAll(where = []) {
      const exclude = ['password', 'createdAt', 'updatedAt'];
      return await Skor.findAll({
        where,
        include: [
          { model: sequelize.models.user, as: 'user', attributes: { exclude } },
          {
            model: sequelize.models.alternatif,
            as: 'alternatif',
            attributes: { exclude },
          },
          {
            model: sequelize.models.nilai_target,
            as: 'nilai_target',
            attributes: { exclude },
          },
        ],
        required: false,
        attributes: { exclude },
        order: [['id', 'ASC']],
      });
    }
  }

  Skor.init(
    {
      user_id: DataTypes.INTEGER,
      alternatif_id: DataTypes.INTEGER,
      nilai_target_id: DataTypes.INTEGER,
      value: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'skor',
      tableName: 'skor',
    }
  );

  return Skor;
};
