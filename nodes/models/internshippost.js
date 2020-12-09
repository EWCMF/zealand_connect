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
      InternshipPost.belongsTo(models.Virksomhed, {
        as: 'virksomhed',
        foreignKey: 'virksomhed_id'
      });
    }
  };
  InternshipPost.init({
    title: DataTypes.STRING,
    email: DataTypes.STRING,
    contact: DataTypes.STRING,
    education: DataTypes.INTEGER,
    country: DataTypes.INTEGER,
    region: DataTypes.INTEGER,
    post_start_date: DataTypes.STRING,
    post_end_date: DataTypes.STRING,
    post_text: DataTypes.TEXT,
    city: DataTypes.TEXT,
    postcode: DataTypes.INTEGER,
    cvr_number: DataTypes.INTEGER,
    company_link: DataTypes.TEXT,
    company_logo: DataTypes.STRING,
    post_document: DataTypes.STRING,
    expired: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'InternshipPost',
  });
  return InternshipPost;
};
