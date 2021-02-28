'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CV_CVtype extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CV_CVtype.init({
    cvtype_id: DataTypes.INTEGER,
    cv_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CV_CVtype',
  });
  return CV_CVtype;
};