'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "InternshipPosts",
        "visible",
        {
          type: Sequelize.BOOLEAN,
        });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "InternshipPosts",
        "visible",
        {
        });
  }
};
