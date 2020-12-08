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
      overskrift: {
        type: Sequelize.STRING
      },
      uddannelse: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      sprog: {
        type: Sequelize.STRING
      },
      speciale: {
        type: Sequelize.STRING
      },
      telefon: {
        type: Sequelize.INTEGER
      },
      linkedIn: {
        type: Sequelize.STRING
      },
      yt_link: {
        type: Sequelize.STRING
      },
      om_mig: {
        type: Sequelize.TEXT
      },
      iT_Kompetencer: {
        type: Sequelize.STRING
      },
      udenlandsophold_og_frivilligt_arbejde: {
        type: Sequelize.TEXT
      },
      erhvervserfaring: {
        type: Sequelize.TEXT
      },
      tidligere_uddannelse: {
        type: Sequelize.TEXT
      },
      hjemmeside: {
        type: Sequelize.STRING
      },
      fritidsinteresser: {
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
    await queryInterface.dropTable('CVs');
  }
};