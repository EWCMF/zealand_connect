const express = require('express');
const router = express.Router();
const { reqLang } = require('../public/javascript/request');
const models = require('../models');

router.get('/', async function(req, res, next){
    const events = await models.Event.findAll({
        raw: true
    });
    console.log(events)

    res.render('calendar', {
        language: reqLang(req, res)
    });
});

router.post('/events', async function(req, res, next){
    const events = await models.Event.findAll({
        raw: true
    });

    res.json(events);
});

module.exports = router;
