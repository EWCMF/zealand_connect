'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    var cvId = await queryInterface.bulkInsert('CVs', [{
      overskrift: 'Tester i database',
      uddannelse: 'Datamatiker',
      email: 'mail@mail.com',
      sprog: 'Dansk',
      speciale: 'Ingen',
      telefon: 12341234,
      linkedIn: 'www.linkedIn.com',
      yt_link: 'www.youtube.com/watch?v=lS_cqkEtvTE',
      om_mig: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor ',
      it_kompetencer: 'Ingen',
      udenlandsophold_og_frivilligt_arbejde: 'Ingen',
      erhvervserfaring: 'Ingen',
      tidligere_uddannelse: 'Ingen',
      hjemmeside: 'www.bilka.dk',
      fritidsinteresser: 'Ingen',
      offentlig: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {
      returning: ['id']
    });

    var studentId = await queryInterface.bulkInsert('Students', [{
      email: 'hans@gmail.com',
      password: '$2b$10$RZMS0Th.ntmF7xuaUYmARO8AZdpX6PpmUWgmeR0DsnMXqtS8gE7.G',
      fornavn: 'Hans',
      efternavn: 'Hansen',
      tlfnr: 77777777,
      foedselsdato: new Date(1999, 1, 18),
      createdAt: new Date(),
      updatedAt: new Date(),
      cv_id: cvId
    }], {returning: ['id']});

    await queryInterface.bulkUpdate('CVs', {
      student_id: studentId
    }, {id: cvId});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('CVs', null, {});
    await queryInterface.bulkDelete('Students', {fornavn: 'Hans'}, {});
  }
};