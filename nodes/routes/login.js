var express = require('express');
var { reqLang } = require('../public/javascript/request');
var router = express.Router();
var passport = require('passport');

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
        case 'incorrectusername': res.render('login', { errormessage: 'Din account findes ikke i vores system gå til opret bruger for at oprette dig i systemet.', virksomhed:"true"}); break;
        case 'incorrectpassword': res.render('login', { errormessage: 'Din account findes i vores system, men dit password er forkert.', virksomhed:"true" }); break;
        case 'notloggedin': res.render('login', { errormessage: 'Du skal logge ind før du kan se din profil.', virksomhed:"true"}); break;
        case 'none': res.redirect('/profiles'); break;
        default: res.render('login'); break;
    }
});


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
        /*if(!user instanceof models.virksomhed){
            return res.redirect('/login'+ //todo custom error message);
        }*/
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