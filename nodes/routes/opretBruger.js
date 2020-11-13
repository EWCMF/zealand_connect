var express = require('express');
var router = express.Router();
var { reqLang } = require('../public/javascript/request');


/* GET login page. */
router.get('/', function (req, res, next) {
res.render('opretBruger', {language: reqLang(req)})

});

router.post('/create', function (req, res) {
    console.log("A memeboi was created")
});

module.exports = router;
