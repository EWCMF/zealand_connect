var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('kontakt', {
        language: reqLang(req, res)
    });
});

module.exports=router;
