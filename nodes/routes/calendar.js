const express = require('express');
const router = express.Router();
const { reqLang } = require('../public/javascript/request');
const models = require('../models');

router.get('/', async function(req, res, next){
    const events = await models.Event.findAll({
        raw: true
    });

    res.render('calendar', {
        language: reqLang(req, res)
    });
});

router.post('/events', async function(req, res, next){
    const events = await models.Event.findAll({
        raw: true
    });

    let options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        timeZoneName: 'short'
      };

    let lang = reqLang(req, res);
    for (const event of events) {
        if (lang === 'en') {
            event.formattedStartDate = new Intl.DateTimeFormat('en-GB', options).format(event.startDate);
            event.formattedEndDate = new Intl.DateTimeFormat('en-GB', options).format(event.endDate);
        } else {
            event.formattedStartDate = new Intl.DateTimeFormat('da-DK', options).format(event.startDate);
            event.formattedEndDate = new Intl.DateTimeFormat('da-DK', options).format(event.endDate);
        }
        
    }

    res.json(events);
});

module.exports = router;
