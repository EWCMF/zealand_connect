'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Virksomhed extends Model {
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
    visible_mail: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    last_login: DataTypes.DATE,
    user_data_consent: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Virksomhed',
  });
  return Virksomhed;
};
