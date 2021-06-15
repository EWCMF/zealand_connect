'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'ProfessorCVs',
      'position_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'ProfessorPositions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'ProfessorCVs',
      'position_id', {});
  }
};
