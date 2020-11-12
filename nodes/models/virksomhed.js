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
    hashedPassword: DataTypes.STRING,
    cvrnr: DataTypes.INTEGER,
    navn: DataTypes.STRING,
    addresse: DataTypes.STRING,
    telefonnr: DataTypes.STRING,
    website: DataTypes.STRING,
    ceo: DataTypes.STRING,
    land: DataTypes.STRING,
    postnr: DataTypes.STRING,
    by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Virksomhed',
  });
  return Virksomhed;
};