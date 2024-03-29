const express = require('express');
const router = express.Router();
const models = require('../models');
const {reqLang} = require('../public/javascript/request');

router.get('/student', async function (req, res, next) {
    res.render('data-consent-student', {
        language: reqLang(req, res)
    });
});

router.get('/company', async function (req, res, next) {
    res.render('data-consent-company', {
        language: reqLang(req, res)
    });
});

router.get('/professor', async function (req, res, next) {
    res.render('data-consent-professor', {
        language: reqLang(req, res)
    });
});

router.post('/', async function (req, res, next) {
    let consent = req.body

    if (consent){
        await models.Student.update({
            user_data_consent: consent
        }, {
            where: {
                id: res.locals.user.id
            }
        })
    }
    return res.status(200).end();
});

router.post('/company', async function (req, res, next) {
    let consent = req.body

    if (consent){
        await models.Virksomhed.update({
            user_data_consent: consent
        }, {
            where: {
                id: res.locals.user.id
            }
        })
    }
    return res.status(200).end();
});

router.post('/professor', async function (req, res, next) {
    let consent = req.body

    if (consent){
        await models.Professor.update({
            user_data_consent: consent
        }, {
            where: {
                id: res.locals.user.id
            }
        })
    }
    return res.status(200).end();
});

module.exports = router;