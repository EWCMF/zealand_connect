'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Virksomheds', 'visible_mail', {
      type: Sequelize.BOOLEAN
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Virksomheds', 'visible_mail', {});
  }
};
