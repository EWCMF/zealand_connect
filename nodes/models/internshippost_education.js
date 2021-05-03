'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InternshipPost_Education extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  InternshipPost_Education.init({
    post_id: DataTypes.INTEGER,
    education_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InternshipPost_Education',
  });
  return InternshipPost_Education;
};