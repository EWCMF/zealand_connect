'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Virksomheds", 
      "description",
      {
        type: Sequelize.TEXT,
      })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Virksomheds', 'description', {});
  }
};
