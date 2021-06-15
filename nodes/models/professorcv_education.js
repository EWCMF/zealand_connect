'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfessorCV_Education extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ProfessorCV_Education.init({
    cv_id: DataTypes.INTEGER,
    education_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProfessorCV_Education',
  });
  return ProfessorCV_Education;
};