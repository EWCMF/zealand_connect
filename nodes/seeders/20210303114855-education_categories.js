'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert(
        'EducationCategories',
        [
          {
            name: "Tech & IT",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Natur & Biotek",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Byg & Konstruktion",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Media & Marketing",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Business & Service",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {},
    ),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('EducationCategories', null, {}),
};
