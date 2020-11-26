'use strict';

const {
  sequelize
} = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn(
      'CVs',
      'student_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Students',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

    await queryInterface.addColumn(
      'Students',
      'cv_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'CVs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn(
      'CVs',
      'student_id'
    );

    await queryInterface.removeColumn(
      'Students',
      'cv_id'
    );
  }
};