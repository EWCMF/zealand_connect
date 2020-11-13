var express = require('express');
var router = express.Router();
var { reqLang } = require('../public/javascript/request');
const models = require('../models');
const createVirksomhed = require('../persistence/usercrud').createVirksomhed;

/* GET login page. */
router.get('/', function (req, res, next) {
res.render('opretBruger', {language: reqLang(req)})

});

router.post('/create', function (req, res) {
    createVirksomhed("mongobab@kelvinlul.dk")
});

module.exports = router;
