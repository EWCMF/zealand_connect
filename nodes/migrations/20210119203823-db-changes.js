'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('InternshipPosts', 'company_logo', {});

    await queryInterface.addColumn('InternshipPosts', 'post_type', {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('InternshipPosts', 'company_logo', {
      type: Sequelize.INTEGER
    });

    await queryInterface.removeColumn('InternshipPosts', 'post_type', {});
  }
};