'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('ProfessorPositions', [{
        name: 'Adjunkt',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lektor',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ProfessorPositions', null, {});
  }
};