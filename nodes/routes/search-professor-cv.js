const express = require('express');
const router = express.Router();
const hbs = require('handlebars');
const fs = require('fs');
const models = require('../models');
const formidable = require("formidable");
const fetch = require('node-fetch');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const {
    reqLang
} = require('../public/javascript/request');
const path = require('path');
const limit = 10;
const {
    Op
} = require('sequelize');
const uploadFolder = require('../constants/references').uploadFolder();
const makeArray = function (body, param) {
    if (body.hasOwnProperty(param)) {
        let array = body[param].split(",");
        body[param] = array;
    }
};

router.get('/:id', async function (req, res) {
    let id = req.params.id

    let cv = await models.ProfessorCV.findOne({
        raw: true,
        nest: true,
        where: {
            id: parseInt(id)
        },
        include: [{
            model: models.Professor,
            as: 'professor'
        }]
    });

    if (cv.linkedIn){
        if (cv.linkedIn.includes("://")) {
            cv.linkedIn = cv.linkedIn.substring(cv.linkedIn.indexOf("://") + 3);
        }
    }

    let ejer = false;
    if (req.user != null) {
        let found = res.locals.user;
        if (found instanceof models.Professor && found.id === cv.professor_id) {
            ejer = true;
        }
    }

    if (!cv.offentlig) {
        if (req.user == null) {
            res.status(403).render('error403', {
                layout: false
            });
        }
    }

    res.render('professor-cv-view', {
        language: reqLang(req, res),
        json: cv,
        ejer: ejer
    });

});

module.exports = router;