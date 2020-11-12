'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Virksomheds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      hashedPassword: {
        type: Sequelize.STRING
      },
      cvrnr: {
        type: Sequelize.INTEGER
      },
      navn: {
        type: Sequelize.STRING
      },
      addresse: {
        type: Sequelize.STRING
      },
      telefonnr: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      ceo: {
        type: Sequelize.STRING
      },
      land: {
        type: Sequelize.STRING
      },
      postnr: {
        type: Sequelize.STRING
      },
      by: {
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
    await queryInterface.dropTable('Virksomheds');
  }
};