'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('CVs', 'iT_Kompetencer', {
      type: Sequelize.TEXT
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('CVs', 'iT_Kompetencer', {
      type: Sequelize.STRING
    });
  }
};
