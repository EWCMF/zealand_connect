
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('InternshipPosts', [{
      title: 'lars',
      email: 'lars@lars.dk',
      country: 1,
      region: 1,
      post_Start_Date: new Date(2020, 1, 2),
      post_End_Date: new Date(2020, 10, 10),
      post_Text: 'Vi mangler flere lars',
      createdAt: new Date (2020, 10, 29),
      updatedAt: new Date(2020, 10, 29)
    }], {});

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
