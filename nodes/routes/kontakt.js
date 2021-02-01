const express = require('express');
const router = express.Router();
const {reqLang} = require('../public/javascript/request');


router.get('/', function(req, res, next) {
    res.render('kontakt', {
        language: reqLang(req, res)
    });
});

module.exports=router;
