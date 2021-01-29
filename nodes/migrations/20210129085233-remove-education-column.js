'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Uddannelser',
      'english_name'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Uddannelser',
      'english_name', {
        type: Sequelize.STRING,
    });
  }
};
