'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Skor extends Model {
    static associate(models) {
      Skor.belongsTo(models.user, { foreignKey: 'user_id', as: 'user' });
      Skor.belongsTo(models.alternatif, { foreignKey: 'kode_alternatif', as: 'alternatif' });
      Skor.belongsTo(models.nilai_target, { foreignKey: 'kode_nilai_target', as: 'nilai_target' });
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
            on: {
              kode_alternatif: sequelize.where(
                sequelize.col('skor.kode_alternatif'),
                '=',
                sequelize.col('alternatif.kode_alternatif')
              ),
            },
          },
          {
            model: sequelize.models.nilai_target,
            as: 'nilai_target',
            attributes: { exclude },
            on: {
              kode_nilai_target: sequelize.where(
                sequelize.col('skor.kode_nilai_target'),
                '=',
                sequelize.col('nilai_target.kode')
              ),
            },
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
      kode_alternatif: DataTypes.STRING,
      kode_nilai_target: DataTypes.STRING,
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
