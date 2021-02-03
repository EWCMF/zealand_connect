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
      Virksomhed.hasMany(models.InternshipPost, {
        as: "internshipPosts",
        foreignKey: "fk_company"
      })
      // define association here
    }
  };
  Virksomhed.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    cvrnr: DataTypes.STRING,
    navn: DataTypes.STRING,
    adresse: DataTypes.STRING,
    tlfnr: DataTypes.STRING,
    hjemmeside: DataTypes.STRING,
    direktoer: DataTypes.STRING,
    land: DataTypes.STRING,
    postnr: DataTypes.STRING,
    by: DataTypes.STRING,
    logo: DataTypes.STRING,
    visible: DataTypes.BOOLEAN,
    visible_mail: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Virksomhed',
  });
  return Virksomhed;
};
