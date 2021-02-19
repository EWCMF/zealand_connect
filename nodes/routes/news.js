const express = require('express');
const router = express.Router();
const { reqLang } = require('../public/javascript/request');
const Models = require('../models');

router.get('/', async function(req, res, next){
    const newsPosts = await Models.NewsPost.findAll({
        raw: true
    });

    res.render('nyheder', {language: reqLang(req, res), json: newsPosts});
});

module.exports = router;
