'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Events",
      "location", {
        type: Sequelize.STRING,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "Events",
      "location", {});
  }
};