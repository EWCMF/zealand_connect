'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('InternshipPosts', 'education');
    await queryInterface.removeColumn('CVs', 'uddannelse');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('InternshipPosts', 'education', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('CVs', 'uddannelse', {
      type: Sequelize.STRING
    });
  }
};
