'use strict';
const { Uddannelse } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Uddannelser',
      'english_name', {
        type: Sequelize.STRING,
      });

    let udd = await Uddannelse.findAll({
      raw: true
    });

    async function update(table, englishName, id) {
      queryInterface.bulkUpdate(table, {
        english_name: englishName
      }, {
        id: id
      });
    }

    let uddTable = 'Uddannelser'
    udd.forEach(async element => {
      switch (element.name) {
        case 'Datamatiker':
          await update(uddTable, "Computer Scientist", element.id)
          break;
        case 'Handelsøkonom':
          await update(uddTable, "Commerce Management", element.id)
          break;
        case 'Finansøkonom':
          await update(uddTable, "Financial Management", element.id)
          break;
        case 'International Handel og Markedsføring':
          await update(uddTable, "International Sales and Marketing", element.id)
          break;
        case 'Innovation og Entrepreneurship':
          await update(uddTable, "Innovation og Entrepreneurship", element.id)
          break;
        case 'Bygningskontruktør':
          await update(uddTable, "Constructing Architect", element.id)
          break;
        case 'Byggetekniker':
          await update(uddTable, "Building Technician", element.id)
          break;
        case 'Installatør, stærkstrøm':
          await update(uddTable, "Electrician", element.id)
          break;                  
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Uddannelser',
      'english_name'
    );
  }
};
