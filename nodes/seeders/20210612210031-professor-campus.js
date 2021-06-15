'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {


    await queryInterface.bulkInsert('ProfessorCampuses', [{
        name: 'Næstved',
        postcode: 4700,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Roskilde',
        postcode: 4000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // {
      //   name: 'Holbæk',
      //   postcode: 4300,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      {
        name: 'Slagelse',
        postcode: 4200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nykøbing Falster',
        postcode: 4800,
        createdAt: new Date(),
        updatedAt: new Date(), 
      },
      {
        name: 'Køge',
        postcode: 4600,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('ProfessorCampuses', null, {});

  }
};