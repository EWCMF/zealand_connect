'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FavouriteCV extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FavouriteCV.init({
    company_id: DataTypes.INTEGER,
    cv_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FavouriteCV',
  });
  return FavouriteCV;
};