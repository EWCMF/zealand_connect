const express = require('express');
const router = express.Router();
const { reqLang } = require('../public/javascript/request');
const Models = require('../models');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;

router.get('/', async function(req, res, next){
    const newsPosts = await Models.NewsPost.findAll({
        raw: true
    });

    res.render('news', {language: reqLang(req, res), json: newsPosts});
});

router.get('/new-post', authorizeUser('admin'), async function(req, res, next){

    res.render('news_post', {language: reqLang(req, res)});
});



module.exports = router;
