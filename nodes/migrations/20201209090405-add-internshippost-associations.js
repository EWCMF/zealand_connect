'use strict';

const {
  sequelize
} = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn(
      'InternshipPosts',
      'virksomhed_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Virksomheds',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'InternshipPosts',
      'virksomhed_id'
    );
  }
};
