'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Professor extends Model {

    static associate(models) {
      Professor.hasOne(models.ProfessorCV, {
        foreignKey: 'professor_id',
        as: 'cv'
      });
    }

  };
  Professor.init({
    fornavn: DataTypes.STRING,
    efternavn: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profilbillede: DataTypes.STRING,
    last_login: DataTypes.DATE,
    user_data_consent: DataTypes.BOOLEAN,
    email_notification_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Professor',
  });
  return Professor;
};