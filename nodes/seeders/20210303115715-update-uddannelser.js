'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
        'Uddannelser',
        [
          {
            name: "Autoteknolog",
            fk_education_category: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Digital Konceptudvikling",
            fk_education_category: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Multimediedesigner",
            fk_education_category: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Produktionsteknolog",
            fk_education_category: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Web Development",
            fk_education_category: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Urban Landskabsingeniør",
            fk_education_category: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Jordbrug",
            fk_education_category: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Jordbrugsteknolog",
            fk_education_category: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Laborant",
            fk_education_category: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Procesteknolog",
            fk_education_category: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "VVS-installatør",
            fk_education_category: 3,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Markedsføringsøkonom",
            fk_education_category: 4,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Serviceøkonom",
            fk_education_category: 5,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Administrationsøkonom",
            fk_education_category: 5,
            createdAt: new Date(),
            updatedAt: new Date()
          },
        ],
        {},
    ),
     await queryInterface.bulkUpdate(
         'Uddannelser',
         [
           {fk_education_category: 1}, {
             where: {
               name: {
                 $in: ["Datamatiker"]
               }
             }
           },
           {fk_education_category: 5}, {
           where: {
             name: {
               $in: ["Handelsøkonom", "Finansøkonom"]
             }
           }
         },
           {fk_education_category: 3}, {
           where: {
             name: {
               $in: ["Bygningskonstruktør", "Byggetekniker", "Installatør, stærkstrøm"]
             }
           }
         },
           {fk_education_category: 4}, {
           where: {
             name: {
               $in: ["Innovation og Entrepreneurship", "International Handel og Markedsføring"]
             }
           }
         },
         ]
     )
  },

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('Uddannelser', null, {}),
};
