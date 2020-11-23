'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert(
      'Virksomheds',
      [
        {
          email:'kontakt@bigfoods.dk',
          password: '$2b$10$RZMS0Th.ntmF7xuaUYmARO8AZdpX6PpmUWgmeR0DsnMXqtS8gE7.G',
          cvrnr: 87654321,
          navn: 'Big Foods A/S',
          adresse: 'Dingovej 12',
          tlfnr: 12810812,
          hjemmeside: 'www.bigfoods.dk',
          direktoer: 'Arne Nielsen',
          land: 'Danmark',
          postnr: 4700,
          by: 'Naestved',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email:'kontakt@shellingston.dk',
          password: '$2b$10$RZMS0Th.ntmF7xuaUYmARO8AZdpX6PpmUWgmeR0DsnMXqtS8gE7.G',
          cvrnr: 19584751,
          navn: 'Shellingston ApS',
          adresse: 'Mortensvej 14',
          tlfnr: 34763267,
          hjemmeside: 'www.shellingston.dk',
          direktoer: 'Jonas Olgaard',
          land: 'Danmark',
          postnr: 2100,
          by: 'Oesterbro',
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
