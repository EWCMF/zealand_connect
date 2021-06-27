'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EducationCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EducationCategory.hasMany(models.Education, {
        as: 'educations',
        foreignKey: 'fk_education_category'
      })
    }
  };
  EducationCategory.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EducationCategory',
  });
  return EducationCategory;
};