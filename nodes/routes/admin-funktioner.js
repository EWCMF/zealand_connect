var express = require('express');
var { reqLang } = require('../public/javascript/request');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('admin-funktioner', {language: reqLang(req, res)})
});

module.exports = router;