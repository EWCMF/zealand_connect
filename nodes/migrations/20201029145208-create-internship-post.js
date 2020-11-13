'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('InternshipPosts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.STRING
      },
      education: {
        type: Sequelize.INTEGER
      },
      country: {
        type: Sequelize.INTEGER
      },
      region: {
        type: Sequelize.INTEGER
      },
      post_start_date: {
        type: Sequelize.DATE
      },
      post_end_date: {
        type: Sequelize.DATE
      },
      post_text: {
        type: Sequelize.TEXT
      },
      city:{
        type: Sequelize.TEXT
      },
      postcode:{
        type: Sequelize.INTEGER
      },
      cvr_number:{
        type: Sequelize.INTEGER
      },
      company_link:{
        type: Sequelize.TEXT
      },
      company_logo:{
        type: Sequelize.STRING
      },
      post_document:{
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('InternshipPosts');
  }
};
