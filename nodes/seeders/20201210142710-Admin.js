'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Admins',
    [
      {
        username: 'admin1',
        password: '$2b$10$RZMS0Th.ntmF7xuaUYmARO8AZdpX6PpmUWgmeR0DsnMXqtS8gE7.G',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Admins', null, {}),
};
