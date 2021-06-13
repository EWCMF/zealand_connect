'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "ProfessorCVs",
      "website",
      {
        type: Sequelize.STRING,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "ProfessorCVs",
      "website",
      {
      });
  }
};
