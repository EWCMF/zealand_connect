'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Professor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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