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
    let errors = req.query;
    console.log("ERRORS!");
    console.log(errors);
    res.render('opret-bruger', {
        emailError: errors.EmailError,
        passwordError: errors.PasswordError,
        tlfnrError: errors.TlfnrError,
        cvrError: errors.CVRError,
        byError: errors.ByError,
        postnrError: errors.PostnrError,
        language: reqLang(req)
    });
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

    let errors = {
        EmailError: "",
        PasswordError: "",
        TlfnrError: "",
        ByError: "",
        CVRError: "",
        PostnrError: "",
    }

    // Grundform for fejlbeskeden
    let error = "?error=";

    if (!validateEmail(email)) {
        errors.EmailError = "Email er ugyldig";
    } else if (!checkForIdenticals(email, gentagEmail)) {
        errors.EmailError = "Email er ikke ens";
    }

    if (!validatePasswordLength(password)) {
        errors.PasswordError = "Adgangskode skal være mellem 8 og 16 tegn";
    }

    if (!validateCVR(cvrnr)) {
        errors.CVRError = "CVR-nummer er ugyldigt";
    } else if (!validateCvrLength(cvrnr)) {
        errors.CVRError = "CVR-nummer skal være 8 cifre";
    }

    if (!validatePhone(tlfnr)) {
        errors.TlfnrError = "Telefonnummer er ugyldigt";
    }

    if (!validateCity(by)) {
        errors.ByError = "By er ugyldig";
    }

    // Tjek om email allerede eksisterer i databasen
    findUserByEmail(email).then((user) => {
        if (user !== null) {
            errors.EmailError = "Email eksisterer allerede i systemet";
        } else {
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
        }
    }).then(() => {
        res.redirect(
            '/opret-bruger?' +
            'EmailError=' + errors.EmailError +
            '&PasswordError=' + errors.PasswordError +
            '&TlfnrError=' + errors.TlfnrError +
            '&ByError=' + errors.ByError +
            '&CVRError=' + errors.CVRError);
    });
});

router.post('/delete', function (req, res) {
    deleteVirksomhed("")
    res.redirect('back');
})

module.exports = router;
