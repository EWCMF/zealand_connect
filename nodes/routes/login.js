var express = require('express');
var {
    reqLang
} = require('../public/javascript/request');
var router = express.Router();
var passport = require('passport');
var models = require('../models');
/* GET login page. */
router.get('/', function (req, res, next) {
    //REQUEST PARAMETERS:
    let error = req.query;
    let msg = error.error;
    let usertype = req.query.usertype;

    switch (msg) {
        case 'incorrectusername':
            res.render('login', {
                errormessage: 'Email eller password er forkert',
                usertype: usertype,
                language: reqLang(req, res)
            },);
            break;
        case 'incorrectpassword':
            res.render('login', {
                errormessage: 'Email eller password er forkert',
                usertype: usertype,
                language: reqLang(req, res)
            });
            break;
        case 'notloggedin':
            res.render('login', {
                errormessage: 'Du skal logge ind før du kan se din profil.',
                usertype: usertype,
                language: reqLang(req, res)
            });
            break;
        case 'incorretemaillogincombination':
            res.render('login', {
                errormessage: 'Email eller password er forkert',
                usertype: usertype,
                language: reqLang(req, res)
            });
            break;
        case 'missingcredentials':
            res.render('login', {
                errormessage: "Begge felter skal udfyldes",
                usertype: usertype,
                language: reqLang(req, res)
            });
            break;  
        case 'none':
            res.redirect('/');
            break;
        default:
            res.render('login', {
                usertype: usertype,
                language: reqLang(req, res),
            });
            break;
    }
});


router.get('/profiles', function (req, res, next) {
    res.send(req.user)
})


router.post('/authenticateUser', function (req, res, next) {
    //fra opret-bruger kommer body som en string version af json object, så den skal lige laves om
    if (typeof (req.body) === "string") {
        req.body = JSON.parse(req.body);
    }
    passport.authenticate('local', function (err, user, info) {

        //handle error
        if (!user) {

            if (info.message === "Missing credentials") {
                return res.redirect('/login?error=missingcredentials')
            }

            return res.redirect('/login' + info.message);
        }
        //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.
        req.logout();
        //login skal være der for, at passport laver en cookie for brugeren
        req.logIn(user, async function (err) {
            if (err) {
                return next(err);
            }

            if (user instanceof models.Student){
                await models.Student.update({
                    last_login: new Date(),
                    email_notification_date: null
                }, {
                    where: {
                        id: user.id
                    }
                })
            }
            else if (user instanceof models.Virksomhed){
                await models.Virksomhed.update({
                    last_login: new Date(),
                    email_notification_date: null
                }, {
                    where: {
                        id: user.id
                    }
                })
            }
            else if (user instanceof models.Professor){
                await models.Professor.update({
                    last_login: new Date(),
                    email_notification_date: null
                }, {
                    where: {
                        id: user.id
                    }
                })
            }

            return res.redirect('/login' + info.message);
        });
    })(req, res, next);
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