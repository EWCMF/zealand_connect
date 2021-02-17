'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CVs', 'postcode', {
      type: Sequelize.INTEGER
    });

    await queryInterface.addColumn('CVs', 'city', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('CVs', 'geo_lat', {
      type: Sequelize.DOUBLE
    });

    await queryInterface.addColumn('CVs', 'geo_lon', {
      type: Sequelize.DOUBLE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CVs', 'postcode', {});
    await queryInterface.removeColumn('CVs', 'city', {});
    await queryInterface.removeColumn('CVs', 'geo_lat', {});
    await queryInterface.removeColumn('CVs', 'geo_lon', {});
  }
};
