var express = require('express');
var { reqLang } = require('../public/javascript/request');
var router = express.Router();
var passport = require('passport');

/* GET login page. */
router.get('/', function (req, res, next) {
res.render('login', {language: reqLang(req)}) 
});


router.post('/authenticateZealandConnect', function (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log('HER ER USER EFTER CALLBACK:');
        console.log(user);
        //handle error
        if(!user){
            return res.redirect('/login'+info.message);
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