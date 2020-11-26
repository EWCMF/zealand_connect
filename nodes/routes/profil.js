var express = require('express');
var router = express.Router();
var { reqLang } = require('../public/javascript/request');


router.get('/', (req, res)=> {
    res.render('visprofil', {language: reqLang(req,res)})
})

router.get('/rediger', function (req, res, next) {
    //todo: find bruger og insæt dens data i render hbs.
    res.render("rediger-virksomhedsprofil");
});

module.exports = router;