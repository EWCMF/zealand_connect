'use strict';

const { InternshipPost, InternshipPost_Education } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let posts = await InternshipPost.findAll({
      raw: true,
      attributes: ['id', 'fk_education']
    })

    console.log(posts)

    for (const post of posts) {
      console.log(post.fk_education)
      await InternshipPost_Education.create({
        post_id: post.id,
        education_id: post.fk_education
      })
    }
  },

  down: async (queryInterface, Sequelize) => {
    await InternshipPost_Education.destroy({
      where: {},
      truncate: true
    });
  }
};
