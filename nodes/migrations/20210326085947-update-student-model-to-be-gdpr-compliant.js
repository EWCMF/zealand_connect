'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "Students",
        "last_login",
        {
          type: Sequelize.DATE,
        })

    await queryInterface.addColumn(
        "Students",
        "user_data_consent",
        {
          type: Sequelize.BOOLEAN,
        })

    await queryInterface.addColumn(
        "Virksomheds",
        "last_login",
        {
          type: Sequelize.DATE,
        })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Students', 'last_login', {});
    await queryInterface.removeColumn('Students', 'user_data_consent', {});
    await queryInterface.removeColumn('Virksomheds', 'last_login', {});
  }
};
