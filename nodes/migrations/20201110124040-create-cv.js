'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CVs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Overskrift: {
        type: Sequelize.STRING
      },
      Uddannelse: {
        type: Sequelize.STRING
      },
      Email: {
        type: Sequelize.STRING
      },
      Sprog: {
        type: Sequelize.STRING
      },
      Speciale: {
        type: Sequelize.STRING
      },
      Telefon: {
        type: Sequelize.INTEGER
      },
      LinkedIn: {
        type: Sequelize.STRING
      },
      Om_mig: {
        type: Sequelize.STRING
      },
      IT_Kompetencer: {
        type: Sequelize.STRING
      },
      Udenlandsophold_og_frivilligt_arbejde: {
        type: Sequelize.STRING
      },
      Erhvervserfaring: {
        type: Sequelize.STRING
      },
      Tidligere_uddannelse: {
        type: Sequelize.STRING
      },
      Hjemmeside: {
        type: Sequelize.STRING
      },
      Fritidsinteresser: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('CVs');
  }
};