var express = require('express');
var { reqLang } = require('../public/javascript/request');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
res.render('login', {language: reqLang(req)}) 
});

module.exports = router;