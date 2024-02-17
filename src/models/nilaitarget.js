'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NilaiTarget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static async getAll(user_id) {
      // return await NilaiTarget
      //   .findOne({
      //     where: { user_id },
      //     order: [['id', 'ASC']],
      //     attributes: { exclude: ['createdAt', 'updatedAt'] },
      //   })
      return await NilaiTarget.findAll({
        where: { user_id },
        order: [['id', 'ASC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      })
      .then(result => result)
      .catch(err => err);
    }
  }
  NilaiTarget.init(
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      kode: DataTypes.STRING,
      value: DataTypes.INTEGER,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'nilai_target',
      tableName: 'nilai_target'
    }
  );
  return NilaiTarget;
};
