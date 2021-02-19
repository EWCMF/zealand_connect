'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('CVs', 'telefon', {
      type: Sequelize.STRING
    });

    await queryInterface.changeColumn('Virksomheds', 'tlfnr', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('CVs', 'telefon', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('Virksomheds', 'tlfnr', {
      type: Sequelize.INTEGER
    });
  }
};
