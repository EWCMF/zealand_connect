'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "CVs", 
      "post_subscription",
      {
        type: Sequelize.BOOLEAN,
      })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CVs', 'post_subscription', {});
  }
};
