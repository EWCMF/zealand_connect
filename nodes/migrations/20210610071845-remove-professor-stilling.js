'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        'ProfessorCVs',
        'stilling');
    await queryInterface.removeColumn(
        'ProfessorCVs',
        'uddannelse');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        'ProfessorCVs',
        'stilling', {
          type: Sequelize.STRING,
        });
    await queryInterface.addColumn(
        'ProfessorCVs',
        'uddannelse', {
          type: Sequelize.STRING,
        });
  }
};
