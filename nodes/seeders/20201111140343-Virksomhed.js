'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert(
      'Virksomhed',
      [
        {
          email:'kontakt@bigfoods.dk',
          hashedPassword: '1234',
          cvrnr: '87654321',
          navn: 'Big Foods A/S',
          addresse: 'Dingovej 12',
          telefonnr: '12810812',
          website: 'www.bigfoods.dk',
          ceo: 'Arne Nielsen',
          land: 'Danmark',
          postnr: '4700',
          by: 'Næstved',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email:'kontakt@shellingston.dk',
          hashedPassword: '1234',
          cvrnr: '19584751',
          navn: 'Shellingston ApS',
          addresse: 'Mortensvej 14',
          telefonnr: '34763267',
          website: 'www.shellingston.dk',
          ceo: 'Jonas Olgaard',
          land: 'Danmark',
          postnr: '2100',
          by: 'Østerbro',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
  ),

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
