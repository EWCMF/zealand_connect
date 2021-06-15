'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn(
        'ProfessorCVs',
        'professor_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'Professors',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn(
        'ProfessorCVs',
        'professor_id'
    );

  }
};
