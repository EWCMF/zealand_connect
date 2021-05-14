'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "ProfessorCVs",
        "tidligere_projekter",
        {
          type: Sequelize.TEXT,
        });
    await queryInterface.addColumn(
        "ProfessorCVs",
        "geo_lat",
        {
          type: Sequelize.DOUBLE,
        });
    await queryInterface.addColumn(
        "ProfessorCVs",
        "geo_lon",
        {
          type: Sequelize.DOUBLE,
        });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "ProfessorCVs",
        "tidligere_projekter",
        {
        });
    await queryInterface.removeColumn(
        "ProfessorCVs",
        "geo_lat",
        {
        });
    await queryInterface.removeColumn(
        "ProfessorCVs",
        "geo_lon",
        {
        });
  }
};
