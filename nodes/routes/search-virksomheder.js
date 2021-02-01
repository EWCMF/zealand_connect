const express = require('express');
const router = express.Router();
const { reqLang } = require('../public/javascript/request');
const { Virksomhed } = require('../models');

router.get('/', async function(req, res, next){

    
    let { 
        count, 
        rows 
    } = await Virksomhed.findAndCountAll({
        raw: true,
        limit: 10
    });

    res.render('search-virksomheder', {
        language: reqLang(req, res),
        resultater: count,
        json: rows
    });
});

module.exports = router;
