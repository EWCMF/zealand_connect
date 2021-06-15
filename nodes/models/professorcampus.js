'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfessorCampus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProfessorCampus.hasMany(models.ProfessorCV, {
        foreignKey: 'campus_id',
        as: 'cvs'
      });
    }
  };
  ProfessorCampus.init({
    name: DataTypes.STRING,
    postcode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProfessorCampus',
  });
  return ProfessorCampus;
};