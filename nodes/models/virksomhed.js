'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Virksomhed extends Model {
    static associate(models) {
      // Relationshop for InternshipPost
      Virksomhed.hasMany(models.InternshipPost, {
        as: "internshipPosts",
        foreignKey: "fk_company"
      })

      // Relationship for FavouriteCV
      Virksomhed.belongsToMany(models.CV, {
        through: models.FavouriteCV,
        foreignKey: "company_id"
      });
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
    land: DataTypes.STRING,
    postnr: DataTypes.STRING,
    by: DataTypes.STRING,
    logo: DataTypes.STRING,
    visible: DataTypes.BOOLEAN,
    visible_mail: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    last_login: DataTypes.DATE,
    user_data_consent: DataTypes.BOOLEAN,
    email_notification_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Virksomhed',
  });
  return Virksomhed;
};
