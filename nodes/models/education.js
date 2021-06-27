'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Education extends Model {
    static associate(models) {
      // define association here
      Education.hasMany(models.CV, {
        as: 'CVs',
        foreignKey: 'fk_education'
      });

      Education.belongsToMany(models.InternshipPost, {
        through: models.InternshipPost_Education,
        foreignKey: 'education_id'
      });

      Education.belongsToMany(models.ProfessorCV, {
        through: models.ProfessorCV_Education,
        foreignKey: 'education_id'
      });

      Education.belongsTo(models.EducationCategory, {
        foreignKey: "fk_education_category",
        as: "education_category"
      });
    }
  };
  Education.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Education',
    tableName: 'Educations',
    freezeTableName: true
  });
  return Education;
};