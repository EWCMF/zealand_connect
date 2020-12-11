var express = require('express');
var router = express.Router();
const { deleteVirksomhed, findUserByEmail } = require('../persistence/usermapping');
var { reqLang } = require('../public/javascript/request');
const {createUddanelse, findUddannelseByName, sletUddannelse} = require('../persistence/uddanelsemapping');
const deleteStudent = require('../persistence/usermapping').deleteStudent;
const models = require('../models');
var passport = require('passport');



router.get('/', function (req, res, next) {
    //check om logged in as admin
    if(req.user != undefined){
        findUserByEmail(req.user).then((user)=>{
            if(user instanceof models.Admin){
                res.render('admin-funktioner', {language: reqLang(req, res)})
            }else {
                res.redirect('/');
            }
        })
    } else res.redirect('/');
});

router.get('/login', function (req, res, next) {
    //check om logged in as admin
    let error = req.query;
       let msg = error.error;
       //console.log("THIS ERROR "+msg);
       switch(msg){
           case 'incorrectusername': res.render('login-admin', { errormessage: 'Du har indtastet forkerte oplysninger'}); break;
           case 'incorrectpassword': res.render('login-admin', { errormessage: 'Du har indtastet forkerte oplysninger' }); break;
           case 'notloggedin': res.render('login-admin', { errormessage: 'Du skal logge ind før du kan se din profil.'}); break;
           case 'none': res.redirect('/admin-funktioner'); break;
           default: res.render('login-admin'); break;
       }
});

router.post('/login/authenticate', function (req, res, next) {
    //check om logged in as admin
    passport.authenticate('local', function(err, user, info) {
        //handle error
        if(!user){
            return res.redirect('/admin-funktioner/login'+info.message);
        }
        //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.
        req.logout();
        //login skal være der for, at passport laver en cookie for brugeren
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/admin-funktioner/login'+info.message);
          });
    })(req, res, next);
});

router.post('/slet-bruger', function (req, res, next) {
    let jsonBody = JSON.parse(req.body);
    console.log(req.body);
    let errorHappened = false;
    if (jsonBody.type == "virksomhed"){
        deleteVirksomhed(jsonBody.email).then((result)=>{
            errorHappened = result;
            res.send('{"errorHappened":'+errorHappened+"}");
        });
    }else {
        deleteStudent(jsonBody.email).then((result)=>{
            errorHappened = result;
            res.send('{"errorHappened":'+errorHappened+"}");
        });
    }
});


router.post('/createUddannelse', (req, res, next)=>{
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name
    let messages= {
        findesallerede: "",
        uddannelseOprettet: ""
    }
   
   findUddannelseByName(name).then((uddannelseFundetMedNavn) =>{
       if(uddannelseFundetMedNavn !== null) { //hvis uddannelsen er i databasen
           messages.findesallerede = "Uddannelsen findes allerede"
           res.send(messages)
       }
       else { // hvis uddannelsen ikke er i databasen
            createUddanelse(name);
            messages.uddannelseOprettet= "Uddannelsen oprettet"
            res.send(messages)
        }
   })
});

router.post('/sletUddannelse', (req, res, next)=> {
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name;
    let messages = {
        findesIkke: "",
        uddannelseSlettet: ""
    }

    findUddannelseByName(name).then((uddannelseFundetMedNavn)=>{
        if(uddannelseFundetMedNavn === null) {
            console.log('sletter ikke noget der ikke findes')
            messages.findesIkke= "Uddannelsen findes ikke"
            res.send(messages);
        }
        else {
            console.log('sletter uddannelse')
            sletUddannelse(name)
            messages.uddannelseSlettet = "Uddannelsen slettet"
            res.send(messages)
        }
    })
})


module.exports = router;