'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Students',
    [
      {
        email:'bob@gmail.com',
        password: '$2b$10$RZMS0Th.ntmF7xuaUYmARO8AZdpX6PpmUWgmeR0DsnMXqtS8gE7.G',
        fornavn: 'Bob',
        efternavn: 'Doe',
        tlfnr: 77777777,
        foedselsdato: new Date(1999,1,18),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Students', null, {}),
};

