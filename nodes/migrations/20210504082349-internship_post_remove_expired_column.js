'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('InternshipPosts', 'expired', {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "InternshipPosts",
      "expired",
      {
        type: Sequelize.BOOLEAN,
      })
  }
};
