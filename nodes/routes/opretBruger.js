var express = require('express');
var router = express.Router();
var { reqLang } = require('../public/javascript/request');
const models = require('../models');
const createVirksomhed = require('../persistence/usercrud').createVirksomhed;
const deleteVirksomhed = require('../persistence/usercrud').deleteVirksomhed;

/* GET login page. */
router.get('/', function (req, res, next) {
res.render('opretBruger', {language: reqLang(req)})

});

router.post('/create', function (req, res) {
    createVirksomhed("memeboi@nielsen.dk")
    res.redirect('back');
});

router.post('/delete', function (req, res) {
    deleteVirksomhed("memeboi@nielsen.dk")
    res.redirect('back');
})

module.exports = router;
