'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert(
      'Virksomheds',
      [
        {
          email:'kontakt@maersk.com',
          password: '$2b$10$RZMS0Th.ntmF7xuaUYmARO8AZdpX6PpmUWgmeR0DsnMXqtS8gE7.G',
          cvrnr: '32345794',
          navn: 'Maersk A/S',
          adresse: 'Esplanaden 50',
          tlfnr: '13243543',
          hjemmeside: 'www.maersk.com',
          direktoer: 'Søren Skou',
          land: 'Danmark',
          postnr: '1263',
          by: 'København K',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email:'kontakt@sallinggroup.com',
          password: '$2b$10$RZMS0Th.ntmF7xuaUYmARO8AZdpX6PpmUWgmeR0DsnMXqtS8gE7.G',
          cvrnr: '35954716',
          navn: 'Salling Group A/S',
          adresse: 'Rosbjergvej 33',
          tlfnr: '34763267',
          hjemmeside: 'www.sallinggroup.com',
          direktoer: '',
          land: 'Danmark',
          postnr: '8220',
          by: 'Brabrand',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Virksomheds', null, {}),
};