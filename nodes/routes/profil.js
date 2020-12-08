var express = require('express');
var router = express.Router();
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const editVirksomhed = require('../persistence/usermapping').editVirksomhed;
const editStudent = require('../persistence/usermapping').editStudent;
const models = require("../models");
const validation = require("../validation/input-validation");
var {
    reqLang
} = require('../public/javascript/request');

router.get('/', function (req, res, next) {
    findUserByEmail(req.user).then((user) => {
        if (user instanceof models.Virksomhed) {
            let loggedInVirksomhed = {
                email: user.email,
                cvrnr: user.cvrnr,
                navn: user.navn,
                adresse: user.adresse,
                tlfnr: user.tlfnr,
                hjemmeside: user.hjemmeside,
                direktoer: user.direktoer,
                land: user.land,
                postnr: user.postnr,
                by: user.by,
            }
            res.render('visprofil', {
                language: reqLang(req, res),
                loggedInVirksomhed
            });
        } else if (user instanceof models.Student) {
            let loggedInUser = {
                email: user.email,
                fornavn: user.fornavn,
                efternavn: user.efternavn,
                tlfnr: user.tlfnr,
            }
            res.render("studentprofil", { loggedInUser });
        }
    });
});

router.get('/rediger', function (req, res, next) {
    let errors = req.query;
    console.log("ERRORS");
    console.log(errors);
    //todo if Student render student else virksomhed
    //todo: find bruger og indsæt dens data i render hbs.
    findUserByEmail(req.user).then((user) => {
        if (user instanceof models.Student) {
            let loggedInUser = {
                email: user.email,
                fornavn: user.fornavn,
                efternavn: user.efternavn,
                tlfnr: user.tlfnr,
            }

            res.render("rediger-studentprofil", { loggedInUser });

        } else {
            let loggedInVirksomhed = {
                email: user.email,
                cvrnr: user.cvrnr,
                navn: user.navn,
                adresse: user.adresse,
                tlfnr: user.tlfnr,
                hjemmeside: user.hjemmeside,
                direktoer: user.direktoer,
                land: user.land,
                postnr: user.postnr,
                by: user.by
            }
            //render with potential errors and information about the profile
            res.render("rediger-virksomhedsprofil", {
                succesBesked: req.query.succesBesked,
                fejlBesked: req.query.fejlBesked,
                EmailError: errors.EmailError,
                TlfnrError: errors.TlfnrError,
                ByError: errors.ByError,
                PostnrError: errors.PostnrError,
                CVRError: errors.CVRError,
                NavnError: errors.NavnError,
                AdresseError: errors.AdresseError,
                HjemmesideError: errors.HjemmesideError,
                DirektoerError: errors.DirektoerError,
                LandError: errors.LandError,
                LogoError: errors.LogoError,
                email: user.email,
                tlfnr: user.tlfnr,
                by: user.by,
                postnummer: user.postnr,
                cvr: user.cvrnr,
                firmanavn: user.navn,
                adresse: user.adresse,
                hjemmeside: user.hjemmeside,
                direktoer: user.direktoer,
                land: user.land,
                language: reqLang(req),
                loggedInVirksomhed
            });
        }
    });
});

router.post('/redigerstudent-save', function (req, res) {
    console.log("her er post request fra redigering af student");
    console.log(req.body);
    let email = req.body.email;
    let fornavn = req.body.fornavn;
    let efternavn = req.body.efternavn;
    let telefon = parseInt(req.body.telefon);

    editStudent(email, fornavn, efternavn, telefon);
    res.redirect('/profil')



    console.log(email + fornavn + efternavn + telefon);
});

router.post('/rediger-save', function (req, res, next) {
    console.log("her er post requesten");
    console.log(req.body);
    //validate
    // Indlæs variable fra viewet
    let email = req.body.email;
    let tlfnr = req.body.telefon;
    let by = req.body.by;
    let postnr = req.body.postnr;
    let cvrnr = req.body.cvrnr;
    let firmanavn = req.body.navn;
    let adresse = req.body.address;
    let hjemmeside = req.body.hjemmeside;
    let direktoer = req.body.direkoer;
    let land = req.body.land;
    editVirksomhed(email, cvrnr, firmanavn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by);
    console.log(email, cvrnr, firmanavn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by);
    res.redirect('/profil')
    //todo logo
    // let errors = {
    //     EmailError: "",
    //     TlfnrError: "",
    //     ByError: "",
    //     PostnrError: "",
    //     CVRError: "",
    //     NavnError: "",
    //     AdresseError: "",
    //     HjemmesideError: "",
    //     DirektoerError: "",
    //     LandError: "",
    //     LogoError: "",
    // }
    // if (!validation.validateCVR(cvrnr)) {
    //     errors.CVRError = "Ugyldigt CVR";
    // } else if (!validation.validateCvrLength(cvrnr)) {
    //     errors.CVRError = "Ugyldigt CVR længde";
    // }

    // if (!validation.validatePhone(tlfnr)) {
    //     errors.TlfnrError = "Ugyldigt Telefonnummer";
    // }

    // if (!validation.validateCity(by)) {
    //     errors.ByError = "Ugyldig By";
    // }
    // //update the database if no erros present
    // let atLeastOneErrorIsPresent = false;
    // for (let value of Object.values(errors)) {
    //     console.log("error:");
    //     console.log(value);
    //     if (value != '') {
    //         //an error was here!
    //         atLeastOneErrorIsPresent = true;
    //         break;
    //     }
    // }
    // let succesBesked = '';
    // let fejlBesked = '';
    // if (!atLeastOneErrorIsPresent) {
    //     editVirksomhed(email, cvrnr, firmanavn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by);
    //     succesBesked = 'Succesfuldt opdateret brugeren';
    // } else {
    //     fejlBesked = 'Fejl ved opdatering af brugeren';
    // }
    // res.redirect('/profil/rediger?succesBesked=' + succesBesked + '&fejlBesked=' + fejlBesked + '&EmailError=' + errors.EmailError + '&TlfnrError=' + errors.TlfnrError + '&ByError=' + errors.ByError + '&PostnrError=' + errors.PostnrError + '&CVRError=' + errors.CVRError + '&NavnError=' + errors.NavnError + '&AdresseError=' + errors.AdresseError + '&HjemmesideError=' + errors.HjemmesideError + '&DirektoerError=' + errors.DirektoerError + '&LandError=' + errors.LandError + '&LogoError=' + errors.LogoError);
});

router.get('/getUser', function (req, res, next) {
    if (req.user != null) {
        findUserByEmail(req.user).then((user) => {
            res.send(user);
        });
    } else {
        res.send({
            email: ""
        });
    }
});



router.get('/getUser', function (req, res, next) {
    findUserByEmail(req.user).then((user) => {
        res.send(user);
    })
});

module.exports = router;