var express = require('express');
var router = express.Router();
var {reqLang} = require('../public/javascript/request');
const createVirksomhed = require('../persistence/usermapping').createVirksomhed;
const deleteVirksomhed = require('../persistence/usermapping').deleteVirksomhed;
const hashPassword = require('../encryption/password').hashPassword;
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const { validateEmail, validateCVR, validatePhone, validateCity, validatePasswordLength, validateCvrLength,
    checkForIdenticals } = require('../validation/input-validation');

router.get('/', function (req, res, next) {
    let error = req.query;
    let msg = error.error;

    switch (msg) {
        case 'invalidemailerror': res.render('opret-bruger', { emailError: "Email er ugyldig", language: reqLang(req, res)}); break;
        case 'emailmismatcherror': res.render('opret-bruger', { emailError: "Email er ikke ens", language: reqLang(req, res)}); break;
        case 'existingemailerror': res.render('opret-bruger', { emailError: "Email eksisterer allerede i systemet", language: reqLang(req, res)}); break;
        case 'passwordlengtherror': res.render('opret-bruger', { passwordError: "Adgangskode skal være mellem 8 og 16 tegn", language: reqLang(req, res)}); break;
        case 'invalidcvrerror': res.render('opret-bruger', { cvrError: "CVR-nummer er ugyldigt", language: reqLang(req, res)}); break;
        case 'cvrlengtherror': res.render('opret-bruger', { cvrError: "CVR-nummer skal være 8 cifre", language: reqLang(req, res)}); break;
        case 'invalidphoneerror': res.render('opret-bruger', { tlfnrError: "Telefonnummer er ugyldigt", language: reqLang(req, res)}); break;
        case 'invalidbyerror': res.render('opret-bruger', { byError: "By er ugyldig", language: reqLang(req, res)}); break;
        default:  res.render('opret-bruger', {language: reqLang(req)}); break;
    }
});

router.post('/create', function (req, res) {
    // Indlæs variable fra viewet
    let email = req.body.email;
    let gentagEmail = req.body.gentagEmail;
    let password = req.body.password;
    let tlfnr = req.body.telefonnummer;
    let by = req.body.by;
    let postnr = req.body.postnummer;
    let cvrnr = req.body.cvr;

    // Grundform for fejlbeskeden
    let error = "?error=";

    if (!validateEmail(email)){
        error += "invalidemailerror";
        res.redirect('/opret-bruger' + error);
    }

    else if (!checkForIdenticals(email, gentagEmail)){
        error += "emailmismatcherror";
        res.redirect('/opret-bruger' + error);
    }

    else if (!validatePasswordLength(password)){
        error += "passwordlengtherror";
        res.redirect('/opret-bruger' + error);
    }

    else if (!validateCVR(cvrnr)){
        error += "invalidcvrerror";
        res.redirect('/opret-bruger' + error);
    }

    else if (!validateCvrLength(cvrnr)){
        error += "cvrlengtherror";
        res.redirect('/opret-bruger' + error);
    }

    if (!validatePhone(tlfnr)){
        error += "invalidphoneerror";
        res.redirect('/opret-bruger' + error);
    }

    if (!validateCity(by)){
        error += "invalidbyerror";
        res.redirect('/opret-bruger' + error);
    }

    // Tjek om email allerede eksisterer i databasen
    findUserByEmail(email).then((user) => {
        if (user !== null){
            error += "existingemailerror";
            console.log(findUserByEmail(email));
            res.redirect('/opret-bruger' + error);
        }
        else {
            hashPassword(req.body.password).then((hashedPassword) => {
                console.log(email);
                let virksomhedsBruger = {
                    email: email,
                    password: hashedPassword,
                    tlfnr: tlfnr,
                    by: by,
                    postnr: postnr,
                    cvrnr: cvrnr
                }

                createVirksomhed(virksomhedsBruger);
            });

            res.redirect('back');
        }
    });
});

router.post('/delete', function (req, res) {
    deleteVirksomhed("")
    res.redirect('back');
})

module.exports = router;
