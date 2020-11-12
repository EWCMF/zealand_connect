'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Virksomhed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Virksomhed.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    cvrnr: DataTypes.INTEGER,
    navn: DataTypes.STRING,
    adresse: DataTypes.STRING,
    tlfnr: DataTypes.INTEGER,
    hjemmeside: DataTypes.STRING,
    direktoer: DataTypes.STRING,
    land: DataTypes.STRING,
    postnr: DataTypes.INTEGER,
    by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Virksomhed',
  });
  return Virksomhed;
};