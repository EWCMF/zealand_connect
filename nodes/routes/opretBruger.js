var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
    var temp = req.acceptsLanguages('da', 'en')
    temp.toString
res.render('opretBruger', {language: temp})
    
});

module.exports = router;