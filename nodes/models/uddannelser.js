'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Uddannelse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Uddannelse.hasMany(models.CV, {
        as: 'CVs',
        foreignKey: 'fk_education'
      });

      Uddannelse.hasMany(models.InternshipPost, {
        as: 'internship_posts',
        foreignKey: 'fk_education'
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