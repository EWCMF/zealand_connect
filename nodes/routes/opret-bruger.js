var express = require('express');
var router = express.Router();
var {reqLang} = require('../public/javascript/request');
const createVirksomhed = require('../persistence/usercrud').createVirksomhed;
const deleteVirksomhed = require('../persistence/usercrud').deleteVirksomhed;
const hashPassword = require('../encryption/password').hashPassword;

/* GET login page. */
router.get('/', function (req, res, next) {
    let error = req.query;
    console.log(error);
    let msg = error.error;
    console.log(msg);

    res.render('opret-bruger', {language: reqLang(req)})
});

router.post('/create', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let tlfnr = req.body.telefonnummer;
    let by = req.body.by;
    let postnr = req.body.postnummer;
    let cvrnr = req.body.cvr;

    let error = "error=";

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    let correctEmail = emailRegex.test(email);

    if (!correctEmail){
        error += "incorrectemail";
        res.redirect('/opret-bruger' + '?' + error);
    }

    // if (cvrnr.length !== 8){
    //     error += "cvrlengtherror";
    //     res.redirect('/opret-bruger' + '?' + error);
    // }

    // hashPassword(req.body.password).then((hashedPassword) => {
    //     let virksomhedsBruger = {
    //         email: req.body.email,
    //         password: hashedPassword,
    //         tlfnr: req.body.telefonnummer,
    //         by: req.body.by,
    //         postnr: req.body.postnummer,
    //         cvrnr: req.body.cvr
    //     }
    //
    //     createVirksomhed(virksomhedsBruger);
    // });
    //
    // res.redirect('back');
});

router.post('/delete', function (req, res) {
    deleteVirksomhed("memeboi@nielsen.dk")
    res.redirect('back');
})

module.exports = router;
