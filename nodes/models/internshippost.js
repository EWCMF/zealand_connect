'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InternshipPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  InternshipPost.init({
    title: DataTypes.STRING,
    email: DataTypes.STRING,
    contact: DataTypes.STRING,
    education: DataTypes.INTEGER,
    country: DataTypes.INTEGER,
    region: DataTypes.INTEGER,
    postStartDate: DataTypes.DATE,
    postEndDate: DataTypes.DATE,
    postText: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'InternshipPost',
  });
  return InternshipPost;
};