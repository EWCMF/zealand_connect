var express = require('express');
var router = express.Router();
var passport = require('passport');
var { reqLang } = require('../public/javascript/request');

/* GET login page. */
router.get('/', function (req, res, next) {
       //REQUEST PARAMETERS:
       let error = req.query;
       let msg = error.error;
       //baseret på fejlbeskeden render vi forskellige ting. hvis 'none' så var der ikke fejl og vi går til forside
       switch(msg){
           case 'incorrectusername': res.render('login-student', { errormessage: 'Din account findes ikke i vores system gå til opret bruger for at oprette dig i systemet.'}); break;
           case 'incorrectpassword': res.render('login-student', { errormessage: 'Din account findes i vores system, men dit password er forkert.' }); break;
           case 'notloggedin': res.render('login-student', { errormessage: 'Du skal logge ind før du kan se din profil.'}); break;
           case 'none': res.redirect('/'); break;
           default: res.render('login-student', { language: reqLang(req, res), hideFooter: true}); break;
       }
});

router.get('/profiles',function(req, res, next) {
    res.send(req.user)
    
})



router.post('/authenticate', function (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        //handle error
        if(!user){
            return res.redirect('/login-student'+info.message);
        }
        //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.
        req.logout();
        //login skal være der for, at passport laver en cookie for brugeren
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/login-student'+info.message);
          });
    })(req, res, next);
});

module.exports = router;