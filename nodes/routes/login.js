var express = require('express');
var { reqLang } = require('../public/javascript/request');
var router = express.Router();
var passport = require('passport');
var models = require('../models');
/* GET login page. */
router.get('/', function (req, res, next) {
    //REQUEST PARAMETERS:
    let error = req.query;
    let check;
    let virksomhed;
    if (req.query.login == "virksomhed") {
        check = "checked";
        virksomhed = true;

    } else {
        check = "";
        virksomhed = false;
    }

    let msg = error.error;
    switch (msg) {
        case 'incorrectusername': res.render('login', { errormessage: 'Din account findes ikke i vores system gå til opret bruger for at oprette dig i systemet.', virksomhed: "true", language: reqLang(req, res) },); break;
        case 'incorrectpassword': res.render('login', { errormessage: 'Din account findes i vores system, men dit password er forkert.', virksomhed: "true", language: reqLang(req, res) }); break;
        case 'notloggedin': res.render('login', { errormessage: 'Du skal logge ind før du kan se din profil.', virksomhed: "true", language: reqLang(req, res) }); break;
        case 'incorretemaillogincombination': res.render('login', { errormessage: 'Din email findes men ikke som en virksomheds konto.', virksomhed: "true", language: reqLang(req, res) }); break;
        case 'none': res.redirect('/'); break;
        default: res.render('login', { language: reqLang(req, res), check, startVirksomhed: virksomhed }); break;
    }
});


router.get('/profiles', function (req, res, next) {
    res.send(req.user)
})


router.post('/authenticateVirksomhed', function (req, res, next) {
    //fra opret-bruger kommer body som en string version af json object, så den skal lige laves om
    if(typeof(req.body)==="string"){
        req.body = JSON.parse(req.body);
    }
    passport.authenticate('local', function(err, user, info) {
        //handle error
        if (!user) {
            return res.redirect('/login' + info.message);
        }
        if (!(user instanceof models.Virksomhed)) {
            return res.redirect('/login?error=incorretemaillogincombination');
        }
        //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.
        req.logout();
        //login skal være der for, at passport laver en cookie for brugeren
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/login' + info.message);
        });
    })(req, res, next);
});

router.post('/authenticateStudent', function (req, res, next) {
    //fra opret-bruger kommer body som en string version af json object, så den skal lige laves om
    if(typeof(req.body)==="string"){
        req.body = JSON.parse(req.body);
    }
    passport.authenticate('local', function(err, user, info) {
        //handle error
        if (!user) {
            return res.redirect('/login' + info.message);
        }
        if (!(user instanceof models.Student)) {
            return res.redirect('/login?error=incorretemaillogincombination');
        }
        //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.
        req.logout();
        //login skal være der for, at passport laver en cookie for brugeren
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/login' + info.message);
        });
    })(req, res, next);
});

//denne route bliver kaldt i layout.hbs, så den ved om man er logget ind eller ej
router.get('/loggedIn', function (req, res, next) {
    if (req.user === undefined) {
        //Brugeren er ikke logget ind
        res.send({
            email: ""
        });
    } else {
        //Brugeren er logget ind
        res.send({
            email: req.user
        });
    }
});

router.get('/logout', function (req, res, next) {
    //angående logout:
    /*Passport exposes a logout() function on req (also aliased as logOut()) 
    that can be called from any route handler which needs to terminate a login session. 
    Invoking logout() will remove the req.user property and clear the login session (if any).*/
    req.logout();
    res.redirect("../");
});

module.exports = router;