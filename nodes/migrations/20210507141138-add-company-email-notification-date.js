'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Virksomheds", 
      "email_notification_date",
      {
        type: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "Virksomheds", 
      "email_notification_date",
      {
    });
  }
};
