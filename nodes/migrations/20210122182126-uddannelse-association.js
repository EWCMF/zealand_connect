'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'CVs',
      'fk_education', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Uddannelser',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

    await queryInterface.addColumn(
      'InternshipPosts',
      'fk_education', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Uddannelser',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'CVs',
      'fk_education'
    );

    await queryInterface.removeColumn(
      'InternshipPosts',
      'fk_education'
    );
  }
};
