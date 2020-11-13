var express = require('express');
var router = express.Router();
var { reqLang } = require('../public/javascript/request');
const models = require('../models');

/* GET login page. */
router.get('/', function (req, res, next) {
res.render('opretBruger', {language: reqLang(req)})

});

router.post('/create', async function (req, res) {
    try {
        const memeboi = await models.Virksomhed.create({email: "memeboi@nielsen.dk"});
        console.log("A memeboi was created");
        // console.log(memeboi instanceof Virksomhed);
        // console.log(memeboi.email);
    } catch (e) {
        console.log(e);
    }

});

module.exports = router;
