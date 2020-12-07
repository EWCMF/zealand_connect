var express = require('express');
const { findUserByCVR } = require('../persistence/usermapping');
var router = express.Router();
var {reqLang} = require('../public/javascript/request');
const createVirksomhed = require('../persistence/usermapping').createVirksomhed;
const deleteVirksomhed = require('../persistence/usermapping').deleteVirksomhed;
const hashPassword = require('../encryption/password').hashPassword;
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const { validateEmail, validateCVR, validatePhone, validateCity, validatePasswordLength, validateCvrLength,
    checkForIdenticals } = require('../validation/input-validation');

router.get('/', function (req, res, next) {
   // let errors = req.query;
   // console.log("ERRORS!");
   // console.log(errors);
    res.render('opret-bruger', {
       // succesBesked: errors.succesBesked,
       // fejlBesked: errors.fejlBesked,
       // emailError: errors.EmailError,
       // passwordError: errors.PasswordError,
       // tlfnrError: errors.TlfnrError,
       // cvrError: errors.CVRError,
       // byError: errors.ByError,
       // postnrError: errors.PostnrError,
        language: reqLang(req)
    });
});

router.post('/createErrors', (req, res) => {
     // Indlæs variable fra viewet
     console.log('before email req.body')
     let jsonBody = JSON.parse(req.body);
     let email = jsonBody.email;

     console.log(jsonBody)

     let gentagEmail = jsonBody.gentagEmail;
     let password = jsonBody.password;
     let gentagPassword = jsonBody.gentagPassword;
     let tlfnr = jsonBody.tflnr;
     let by = jsonBody.by;
     let postnr = jsonBody.postnr;
     let cvrnr = jsonBody.cvrnr;

     //reset errors
     let atLeastOneErrorIsPresent = false;
     let errors = {
        EmailError: "",
        PasswordError: "",
        TlfnrError: "",
        ByError: "",
        CVRError: "",
        PostnrError: "",
    }
    

    // valider 
    if (!validateEmail(email)) {
        errors.EmailError = "Email er ugyldig";
        atLeastOneErrorIsPresent = true;
    } else if (!checkForIdenticals(email, gentagEmail)) {
        errors.EmailError = "Email er ikke ens";
        atLeastOneErrorIsPresent = true;
    }

    if (!validatePasswordLength(password)) {
        errors.PasswordError = "Adgangskode skal være mellem 8 og 16 tegn";
        atLeastOneErrorIsPresent = true;
    } else if (!checkForIdenticals(password, gentagPassword)) {
        errors.PasswordError = "Passwords er ikke ens";
        atLeastOneErrorIsPresent = true;
    }

    if (!validateCVR(cvrnr)) {
        errors.CVRError = "CVR-nummer er ugyldigt";
        atLeastOneErrorIsPresent = true;
    } else if (!validateCvrLength(cvrnr)) {
        errors.CVRError = "CVR-nummer skal være 8 cifre";
        atLeastOneErrorIsPresent = true;
    }

    if (!validatePhone(tlfnr)) {
        errors.TlfnrError = "Telefonnummer er ugyldigt";
        atLeastOneErrorIsPresent = true;
    }

    if (!validateCity(by)) {
        errors.ByError = "By er ugyldig";
        atLeastOneErrorIsPresent = true;
    }

    
    findUserByEmail(email).then((userFoundByEmail) => {
        let aUserExistsWithThatEmail = false;
        if (userFoundByEmail !== null) {
            errors.EmailError = "Email findes allerede i systemet";
            aUserExistsWithThatEmail = true;
            atLeastOneErrorIsPresent = true;
        }
        findUserByCVR(cvrnr).then((userFoundByCVR) => {
            if (userFoundByCVR !== null){
                errors.CVRError = "CVR-nummer findes allerede i systemet";
                atLeastOneErrorIsPresent = true;
            } 
            res.send(errors);
        })
    })
});
    


router.post('/create', function (req, res) {

   
    findUserByEmail(email).then((userFoundByEmail) => {
        let aUserExistsWithThatEmail = false;
        if (userFoundByEmail !== null) {
            errors.EmailError = "Email findes allerede i systemet";
            aUserExistsWithThatEmail = true;
            atLeastOneErrorIsPresent = true;
        }
        findUserByCVR(cvrnr).then((userFoundByCVR) => {
            if (userFoundByCVR !== null){
                errors.CVRError = "CVR-nummer findes allerede i systemet";
                atLeastOneErrorIsPresent = true;
            } else if(!atLeastOneErrorIsPresent){
                hashPassword(req.body.password).then((hashedPassword) => {
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
        })
    }).then(() => {
        let succesBesked = '';
        let fejlBesked = '';
        if(atLeastOneErrorIsPresent){
            fejlBesked='Fejl ved oprettelse af bruger';
        } else {
            succesBesked='Succesfuld brugeroprettelse';
        }
        
        res.redirect(
            '/opret-bruger?' +
            'succesBesked=' + succesBesked +
            '&fejlBesked=' + fejlBesked +
            '&EmailError=' + errors.EmailError +
            '&PasswordError=' + errors.PasswordError +
            '&TlfnrError=' + errors.TlfnrError +
            '&ByError=' + errors.ByError +
            '&CVRError=' + errors.CVRError);
    });
});

router.post('/delete', function (req, res) {
    deleteVirksomhed("")
    res.redirect('back');
});

module.exports = router;