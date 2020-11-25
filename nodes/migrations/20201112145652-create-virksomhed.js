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
      password: {
        type: Sequelize.STRING
      },
      cvrnr: {
        type: Sequelize.STRING
      },
      navn: {
        type: Sequelize.STRING
      },
      adresse: {
        type: Sequelize.STRING
      },
      tlfnr: {
        type: Sequelize.STRING
      },
      hjemmeside: {
        type: Sequelize.STRING
      },
      direktoer: {
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
