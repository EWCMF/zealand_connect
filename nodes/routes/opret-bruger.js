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

    // Email skal følge et specifik format givet ved regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    let correctEmail = emailRegex.test(email);
    if (!correctEmail){
        error += "invalidemailerror";
        res.redirect('/opret-bruger' + error);
    }

    // Email skal være ens
    else if (email !== gentagEmail){
        error += "emailmismatcherror";
        res.redirect('/opret-bruger' + error);
    }

    // Password skal være mellem 8 og 16 karakterer
    else if (password.length < 8 || password.length > 16){
        error += "passwordlengtherror";
        res.redirect('/opret-bruger' + error);
    }

    // CVR skal være præcis 8 cifre
    const cvrRegex = /^[0-9]{8}$/
    let correctCVR = cvrRegex.test(cvrnr);
    if (!correctCVR){
        error += "invalidcvrerror";
        res.redirect('/opret-bruger' + error);
    }

    // Ekstra tjek på cvr længde
    if (cvrnr.length !== 8){
        error += "cvrlengtherror";
        res.redirect('/opret-bruger' + error);
    }

    // Tlf tager kun imod landekode og tal
    const tlfRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
    let correctTlf = tlfRegex.test(tlfnr);
    if (!correctTlf){
        error += "invalidphoneerror";
        res.redirect('/opret-bruger' + error);
    }

    // By tager kun imod bogstaver og mellemrum
    const byRegex = /^[a-zA-Z ]*$/
    let correctBy = byRegex.test(by);
    if (!correctBy){
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

            res.redirect('back');
        }
    });

});

router.post('/delete', function (req, res) {
    deleteVirksomhed("memeboi@nielsen.dk")
    res.redirect('back');
})

module.exports = router;
