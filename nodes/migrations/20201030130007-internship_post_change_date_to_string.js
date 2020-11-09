'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('InternshipPosts', 'post_start_date', {
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('InternshipPosts', 'post_end_date', {
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
