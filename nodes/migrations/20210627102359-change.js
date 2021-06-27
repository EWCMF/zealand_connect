'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('Uddannelser', 'Educations');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('Educations', 'Uddannelser');
  }
};
