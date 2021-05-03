'use strict';

const models = require('../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {

        /**
         * Add new uddannelser
         */
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
                {
                    name: "Installatør, stærkstrøm",
                    fk_education_category: 3,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Byggetekniker",
                    fk_education_category: 3,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Bygningskonstruktør",
                    fk_education_category: 3,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Innovation og Entrepreneurship",
                    fk_education_category: 4,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "International Handel og Markedsføring",
                    fk_education_category: 4,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Finansøkonom",
                    fk_education_category: 5,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Handelsøkonom",
                    fk_education_category: 5,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Datamatiker",
                    fk_education_category: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "IT-sikkerhed",
                    fk_education_category: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ],
            {},
        )
    },

    down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('Uddannelser', null, {}),
};
