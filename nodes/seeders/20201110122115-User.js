'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [
      {
        username:'janedoe@example.com',
        password: '1234',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jondoe@example.com',
        password: '12345',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        username:'bob@gmail.com',
        password: '$2b$10$RZMS0Th.ntmF7xuaUYmARO8AZdpX6PpmUWgmeR0DsnMXqtS8gE7.G',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
