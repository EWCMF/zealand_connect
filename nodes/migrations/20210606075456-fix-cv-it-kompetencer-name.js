'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('CVs', 'iT_Kompetencer', 'it_kompetencer');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('CVs', 'it_kompetencer', 'iT_Kompetencer');
  }
};
