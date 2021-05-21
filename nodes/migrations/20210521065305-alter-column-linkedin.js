'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        'ProfessorCVs',
        'linkedin', {});

    await queryInterface.addColumn(
        "ProfessorCVs",
        "linkedIn",
        {
          type: Sequelize.STRING,
        });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        'ProfessorCVs',
        'linkedIn', {});

    await queryInterface.addColumn(
        "ProfessorCVs",
        "linkedin",
        {
          type: Sequelize.STRING,
        });
  }
};
