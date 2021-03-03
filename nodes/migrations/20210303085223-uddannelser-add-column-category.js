'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        'Uddannelser',
        'fk_education_category', {
          type: Sequelize.INTEGER,
          references: {
            model: 'EducationCategories',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Uddannelser', 'fk_education_category', {});
  }
};
