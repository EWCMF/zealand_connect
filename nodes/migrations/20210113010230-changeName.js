'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn(
      'InternshipPosts',
      'virksomhed_id'
    );

    await queryInterface.addColumn(
      'InternshipPosts',
      'fk_company', {
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
      'fk_company'
    );

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
  }
};
