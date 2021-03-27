'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "Virksomheds",
        "user_data_consent",
        {
          type: Sequelize.BOOLEAN,
        })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Virksomheds', 'user_data_consent', {});
  }
};
