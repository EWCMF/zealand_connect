'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
        'CVtypes',
        'cv_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'CVs',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        });
    await queryInterface.addColumn(
        'CVtypes',
        'student_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'Students',
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
        'CVtypes',
        'cv_id'
    );
    await queryInterface.removeColumn(
        'CVtypes',
        'student_id'
    );
  }
};
