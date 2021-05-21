'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProfessorCVs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      overskrift: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      telefon: {
        type: Sequelize.STRING
      },
      sprog: {
        type: Sequelize.STRING
      },
      linkedIn: {
        type: Sequelize.STRING
      },
      postcode: {
        type: Sequelize.INTEGER
      },
      city: {
        type: Sequelize.STRING
      },
      arbejdssted: {
        type: Sequelize.STRING
      },
      stilling: {
        type: Sequelize.STRING
      },
      uddannelse: {
        type: Sequelize.STRING
      },
      teaches: {
        type: Sequelize.STRING
      },
      about: {
        type: Sequelize.TEXT
      },
      it_kompetencer: {
        type: Sequelize.TEXT
      },
      interesser: {
        type: Sequelize.STRING
      },
      erhvervserfaring: {
        type: Sequelize.TEXT
      },
      tidligere_uddannelse: {
        type: Sequelize.TEXT
      },
      offentlig: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('ProfessorCVs');
  }
};