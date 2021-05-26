'use strict';

const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('CVs', 'offentlig', 'availability');

    await queryInterface.changeColumn('CVs', 'availability', {
      type: Sequelize.INTEGER
    });

    await queryInterface.sequelize.query('UPDATE CVs SET availability = 2 WHERE availability = 1;');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('UPDATE CVs SET availability = 1 WHERE availability = 2;');

    await queryInterface.changeColumn('CVs', 'availability', {
      type: Sequelize.BOOLEAN
    });

    await queryInterface.renameColumn('CVs', 'availability', 'offentlig');
  }
};