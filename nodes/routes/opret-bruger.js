var express = require('express');
var router = express.Router();
var {reqLang} = require('../public/javascript/request');
const createVirksomhed = require('../persistence/usercrud').createVirksomhed;
const deleteVirksomhed = require('../persistence/usercrud').deleteVirksomhed;
const hashPassword = require('../encryption/password').hashPassword;
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;

/* GET login page. */
router.get('/', function (req, res, next) {
    let error = req.query;
    let msg = error.error;

    switch (msg) {
        case 'incorrectemailerror': res.render('opret-bruger', { emailError: "Du har indtastet en ugyldig email", language: reqLang(req, res)}); break;
        case 'emailmismatcherror': res.render('opret-bruger', { emailError: "Email er ikke ens", language: reqLang(req, res)}); break;
        case 'existingemailerror': res.render('opret-bruger', { emailError: "Denne email eksisterer allerede i systemet", language: reqLang(req, res)}); break;
        case 'passwordlengtherror': res.render('opret-bruger', { emailError: "Din adgangskode skal være mellem 8 og 16 tegn", language: reqLang(req, res)}); break;
        case 'cvrlengtherror': res.render('opret-bruger', { emailError: "CVR-nummer skal være 8 cifre", language: reqLang(req, res)}); break;
        default:  res.render('opret-bruger', {language: reqLang(req)}); break;
    }
});

router.post('/create', function (req, res) {
    let email = req.body.email;
    let gentagEmail = req.body.gentagEmail;
    let password = req.body.password;
    let tlfnr = req.body.telefonnummer;
    let by = req.body.by;
    let postnr = req.body.postnummer;
    let cvrnr = req.body.cvr;

    let error = "?error=";

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    let correctEmail = emailRegex.test(email);

    if (!correctEmail){
        error += "incorrectemailerror";
        res.redirect('/opret-bruger' + error);
    }
    else if (email !== gentagEmail){
        error += "emailmismatcherror";
        res.redirect('/opret-bruger' + error);
    }

    // Password skal være mellem 8 og 16 karakterer
    else if (password.length < 8 || password.length > 16){
        error += "passwordlengtherror";
        res.redirect('/opret-bruger' + error);
    }

    if (cvrnr.length !== 8){
        error += "cvrlengtherror";
        res.redirect('/opret-bruger' + '?' + error);
    }

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

    findUserByEmail(email).then((user) => {
        if (user !== null){
            error += "existingemailerror";
            console.log(findUserByEmail(email));
            res.redirect('/opret-bruger' + error);
        }
        else {
            res.redirect('back');
        }
    });

});

router.post('/delete', function (req, res) {
    deleteVirksomhed("memeboi@nielsen.dk")
    res.redirect('back');
})

module.exports = router;
