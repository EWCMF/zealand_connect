'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Uddannelser', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addColumn(
        'Uddannelser',
        'fk_education_category', {
          type: Sequelize.INTEGER
        });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Uddannelser');
  }
};
