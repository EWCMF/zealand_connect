'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Students", 
      "email_notification_date",
      {
        type: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Students', 'email_notification_date', {});
  }
};
