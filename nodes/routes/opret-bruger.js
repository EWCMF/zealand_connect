var express = require('express');
var router = express.Router();
var {reqLang} = require('../public/javascript/request');
const createVirksomhed = require('../persistence/usercrud').createVirksomhed;
const deleteVirksomhed = require('../persistence/usercrud').deleteVirksomhed;
const hashPassword = require('../encryption/password').hashPassword;

/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('opret-bruger', {language: reqLang(req)})
});

router.post('/create', function (req, res) {
    hashPassword(req.body.password).then((hashedPassword) => {
        let virksomhedsBruger = {
            email: req.body.email,
            password: hashedPassword,
            tlfnr: req.body.telefonnummer,
            by: req.body.by,
            postnr: req.body.postnummer,
            cvrnr: req.body.cvr
        }

        createVirksomhed(virksomhedsBruger);
    });

    res.redirect('back');
});

router.post('/delete', function (req, res) {
    deleteVirksomhed("memeboi@nielsen.dk")
    res.redirect('back');
})

module.exports = router;
