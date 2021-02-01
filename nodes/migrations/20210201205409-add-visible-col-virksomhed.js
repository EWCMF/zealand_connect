'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('Virksomheds', 'visible', {
      type: Sequelize.BOOLEAN
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Virksomheds', 'visible', {});
  }
};
