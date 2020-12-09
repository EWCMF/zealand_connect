'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('InternshipPosts', 'region', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('InternshipPosts', 'dawa_json', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('InternshipPosts', 'dawa_uuid', {
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('InternshipPosts', 'region', {
      type: Sequelize.INTEGER
    });
    await queryInterface.removeColumn('InternshipPosts', 'dawa_json');
    await queryInterface.removeColumn('InternshipPosts', 'dawa_uuid')
  }
};
