var express = require('express');
var { reqLang } = require('../public/javascript/request');
var router = express.Router();
var passport = require('passport');
var models = require('../models');
/* GET login page. */
router.get('/', function (req, res, next) {
    //REQUEST PARAMETERS:
    let error = req.query;
    //console.log("QUERY");
    //console.log(req.user);
    //console.log("her er fejl json objektet:");
    //console.log("\n"+JSON.stringify(error)+"\n");
    let msg = error.error;
    //console.log("THIS ERROR "+msg);
    switch(msg){
        case 'incorrectusername': res.render('login', { errormessage: 'Din account findes ikke i vores system gå til opret bruger for at oprette dig i systemet.', virksomhed:"true", language: reqLang(req, res)}, ); break;
        case 'incorrectpassword': res.render('login', { errormessage: 'Din account findes i vores system, men dit password er forkert.', virksomhed:"true", language: reqLang(req, res) }); break;
        case 'notloggedin': res.render('login', { errormessage: 'Du skal logge ind før du kan se din profil.', virksomhed:"true",language: reqLang(req, res) }); break;
        case 'incorretemaillogincombination': res.render('login', { errormessage: 'Din email findes men ikke som en virksomheds konto.', virksomhed:"true", language: reqLang(req, res)}); break;
        case 'none': res.redirect('/login/profiles'); break;
        default: res.render('login', {language: reqLang(req, res)}); break;
    }
});


router.get('/profiles',function(req, res, next) {
    res.send(req.user)
    
})


router.post('/authenticateVirksomhed', function (req, res, next) {
    //console.log('HER ER REQUESTEN FRA POST!!!!!!!!!!!!!');
    //console.log(req.body);
    passport.authenticate('local', function(err, user, info) {
        //console.log('HER ER USER EFTER CALLBACK:');
        //console.log(user);
        //handle error
        if(!user){
            return res.redirect('/login'+info.message);
        }
        //todo fjern udkommentering når virksomhedstabellen er i databasen
        if(!(user instanceof models.Virksomhed)){
            return res.redirect('/login?error=incorretemaillogincombination');
        }
        //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.
        req.logout();
        //login skal være der for, at passport laver en cookie for brugeren
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/login'+info.message);
          });
    })(req, res, next);
});
module.exports = router;