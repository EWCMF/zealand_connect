'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Virksomheds', 'direktoer', {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Virksomheds",
      "direktoer",
      {
        type: Sequelize.STRING,
      })
  }
};
