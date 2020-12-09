'use strict';
const {
  Model, STRING
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
    region: DataTypes.STRING,
    post_start_date: DataTypes.STRING,
    post_end_date: DataTypes.STRING,
    post_text: DataTypes.TEXT,
    city: DataTypes.TEXT,
    postcode: DataTypes.INTEGER,
    cvr_number: DataTypes.INTEGER,
    company_link: DataTypes.TEXT,
    company_logo: DataTypes.STRING,
    post_document: DataTypes.STRING,
    dawa_json: DataTypes.TEXT,
    dawa_uuid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'InternshipPost',
  });
  return InternshipPost;
};
