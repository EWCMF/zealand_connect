'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'ProfessorCVs',
      'campus_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'ProfessorCampuses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'ProfessorCVs',
      'campus_id', {});
  }
};
