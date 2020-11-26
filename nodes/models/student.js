'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.hasOne(models.CV, {
        as: 'student',
        foreignKey: 'student_id'
      });
    }
  };
  Student.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fornavn: DataTypes.STRING,
    efternavn: DataTypes.STRING,
    tlfnr: DataTypes.INTEGER,
    foedselsdato: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};