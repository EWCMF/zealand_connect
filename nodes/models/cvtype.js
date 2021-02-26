'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CVtype extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CVtype.belongsToMany(models.CV, {
        through: models.CV_CVtype,
        foreignKey: "cvtype_id",
        as: "cvtype"
        /* options */ });
    }
  };
  CVtype.init({
    cvType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CVtype',
  });
  return CVtype;
};