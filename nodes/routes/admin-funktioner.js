var express = require('express');
var router = express.Router();
const {deleteVirksomhed, searchVirksomhederByName} = require('../persistence/usermapping');
var {reqLang} = require('../public/javascript/request');
const {createUddanelse, findUddannelseByName, sletUddannelse} = require('../persistence/uddanelsemapping');
const deleteStudent = require('../persistence/usermapping').deleteStudent;
var passport = require('passport');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;

router.get('/', authorizeUser('admin'), function (req, res, next) {
    // Hele authorization håndteres nu af en middleware function
    res.render('admin-funktioner', {language: reqLang(req, res)})
});

router.get('/login', function (req, res, next) {
    //check om logged in as admin
    let error = req.query;
    let msg = error.error;
    switch (msg) {
        case 'incorrectusername':
            res.render('login-admin', {errormessage: 'Email eller password er forkert'});
            break;
        case 'incorrectpassword':
            res.render('login-admin', {errormessage: 'Email eller password er forkert'});
            break;
        case 'notloggedin':
            res.render('login-admin', {errormessage: 'Du skal logge ind før du kan se din profil.'});
            break;
        case 'none':
            res.redirect('/admin-funktioner');
            break;
        default:
            res.render('login-admin');
            break;
    }
});

router.post('/login/authenticate', function (req, res, next) {
    //check om logged in as admin
    passport.authenticate('local', function (err, user, info) {
        //handle error
        if (!user) {
            return res.redirect('/admin-funktioner/login' + info.message);
        }
        //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.
        req.logout();
        //login skal være der for, at passport laver en cookie for brugeren
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/admin-funktioner/login' + info.message);
        });
    })(req, res, next);
});

router.post('/slet-bruger', authorizeUser('admin'), function (req, res, next) {
    let jsonBody = JSON.parse(req.body);
    let errorHappened = false;
    if (jsonBody.type == "virksomhed") {
        deleteVirksomhed(jsonBody.email).then((result) => {
            errorHappened = result;
            res.send('{"errorHappened":' + errorHappened + "}");
        });
    } else {
        deleteStudent(jsonBody.email).then((result) => {
            errorHappened = result;
            res.send('{"errorHappened":' + errorHappened + "}");
        });
    }
});


router.post('/createUddannelse', authorizeUser('admin'), (req, res, next) => {
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name
    let messages = {
        findesallerede: "",
        uddannelseOprettet: ""
    }

    findUddannelseByName(name).then((uddannelseFundetMedNavn) => {
        if (uddannelseFundetMedNavn !== null) { //hvis uddannelsen er i databasen
            messages.findesallerede = "Uddannelsen findes allerede"
            res.send(messages)
        } else { // hvis uddannelsen ikke er i databasen
            createUddanelse(name);
            messages.uddannelseOprettet = `Uddannelsen ${name} oprettet`
            res.send(messages)
        }
    })
});

router.post('/sletUddannelse', authorizeUser('admin'), (req, res, next) => {
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name;
    let messages = {
        findesIkke: "",
        uddannelseSlettet: ""
    }

    findUddannelseByName(name).then((uddannelseFundetMedNavn) => {
        if (uddannelseFundetMedNavn === null) {
            messages.findesIkke = "Uddannelsen findes ikke"
            res.send(messages);
        } else {
            sletUddannelse(name)
            messages.uddannelseSlettet = `Uddannelsen ${name} slettet`
            res.send(messages)
        }
    })
});

router.post('/search-virksomhed', authorizeUser('admin'), async (req, res) => {
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name;

    let data = await searchVirksomhederByName(name);

    res.send(data);
});


module.exports = router;