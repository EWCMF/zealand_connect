'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Uddannelse extends Model {
    static associate(models) {
      // define association here
      Uddannelse.hasMany(models.CV, {
        as: 'CVs',
        foreignKey: 'fk_education'
      });

      Uddannelse.belongsToMany(models.InternshipPost, {
        through: models.InternshipPost_Education,
        foreignKey: 'education_id'
      })

      Uddannelse.belongsTo(models.EducationCategory, {
        foreignKey: "fk_education_category",
        as: "education_category"
      });
    }
  };
  Uddannelse.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Uddannelse',
    tableName: 'Uddannelser',
    freezeTableName: true
  });
  return Uddannelse;
};