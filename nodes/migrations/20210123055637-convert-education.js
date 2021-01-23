'use strict';
const { Uddannelse } = require('../models');
const { InternshipPost } = require('../models');
const { CV } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let udd = await Uddannelse.findAll({
      raw: true
    });

    let int = await InternshipPost.findAll({
      raw: true,
      attributes: ['id', 'education', 'fk_education']
    });

    let cvs = await CV.findAll({
      raw: true,
      attributes: ['id', 'uddannelse', 'fk_education']
    });

    int.forEach(async element => {
      if (element.fk_education == null) {
        await queryInterface.bulkUpdate('InternshipPosts', {
          fk_education: element.education
        }, {
          id: element.id 
        });
      }
    });
    
    cvs.forEach(async element => {
      if (element.fk_education == null) {
        let id;
        udd.forEach(element2 => {
          if (element.uddannelse == element2.name) {
            id = element2.id;
            return;
          }
        });
        if (id != null) {
          await queryInterface.bulkUpdate('CVs', {
            fk_education: id
          }, {
            id: element.id 
          });
        }
      }
    });

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

    let udd = await Uddannelse.findAll({
      raw: true
    });

    let int = await InternshipPost.findAll({
      raw: true,
      attributes: ['id', 'education', 'fk_education']
    });

    let cvs = await CV.findAll({
      raw: true
    });

    int.forEach(async element => {
      if (element.education == null) {
        await queryInterface.bulkUpdate('InternshipPosts', {
          education: element.fk_education
        }, {
          id: element.id 
        });
      }
    });

    cvs.forEach(async element => {
      if (element.uddannelse == null) {
        let name;
        udd.forEach(element2 => {
          if (element.fk_education == element2.id) {
            name = element2.name;
            return;
          }
        });
        if (name != null) {
          await queryInterface.bulkUpdate('CVs', {
            uddannelse: name
          }, {
            id: element.id 
          });
        }
      }
    });
  }
};
