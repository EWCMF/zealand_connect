const express = require('express');
const router = express.Router();
const { reqLang } = require('../public/javascript/request');
const models = require('../models');

router.get('/', async function(req, res, next){
    const events = await models.Event.findAll({
        raw: true
    });

    let isAdmin = res.locals.isAdmin;

    res.render('calendar', {
        isAdmin: isAdmin,
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

router.post('/create-event', function(req, res) {
    let {
        title,
        startDate,
        endDate,
        allDay,
        startTime,
        endTime,
        location,
        url,
        description
    } = req.body;

    if (!startDate || !description) {
        return res.send('One or more values in the form are missing');
    }

    if (allDay) {
        startDate = new Date(startDate);
        if (!endDate) {
            endDate = new Date(startDate);
        } else {
            endTime = new Date(endDate);
        }   
    } else {
        if (startTime && endTime && endDate) {
            startDate = new Date(startDate + "T" + startTime);
            endDate = new Date(endDate + "T" + endTime)
        } else {
            return res.send('One or more values in the form are missing')
        }
    }

    models.Event.create({
        title: title,
        startDate: startDate,
        endDate: endDate,
        allday: allDay === 'on' ? true : false,
        description: description,
        location: location ? location : null,
        url: url ? url : null,
    });

    res.redirect('/calendar');
});

module.exports = router;
