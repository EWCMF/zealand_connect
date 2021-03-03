'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert('Uddannelser', [{
        name: "Datamatiker",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Handelsøkonom",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Finansøkonom",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "International Handel og Markedsføring",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Innovation og Entrepreneurship",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Bygningskonstruktør",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Byggetekniker",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Installatør, stærkstrøm",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Uddannelser', null, {});
  }
};