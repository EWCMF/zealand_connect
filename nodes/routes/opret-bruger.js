var express = require('express');
const { findUserByCVR } = require('../persistence/usermapping');
var router = express.Router();
var {reqLang} = require('../public/javascript/request');
const createVirksomhed = require('../persistence/usermapping').createVirksomhed;
const deleteVirksomhed = require('../persistence/usermapping').deleteVirksomhed;
const createStudent = require('../persistence/usermapping').createStudent;
const hashPassword = require('../encryption/password').hashPassword;
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const { validateEmail, validateCVR, validatePhone, validateCity, validatePasswordLength, validateCvrLength,
    checkForIdenticals, 
    validateNavn,
    validateCprLength} = require('../validation/input-validation');

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

router.get('/student', function(req, res, next) {
    res.render('opret-student', {language: reqLang(req)})
})

router.post('/create', (req, res) => {


     // Indlæs variable fra viewet
     let jsonBody = JSON.parse(req.body);
     let email = jsonBody.email;
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
        areThereErrors: "true",
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
            if(!atLeastOneErrorIsPresent) {
                hashPassword(password).then((hashedPassword) => {
                    let virksomhedsBruger = {
                        email: email,
                        password: hashedPassword,
                        tlfnr: tlfnr,
                        by: by,
                        postnr: postnr,
                        cvrnr: cvrnr
                    }
                    createVirksomhed(virksomhedsBruger).then(()=>{
                        //vi sender errors tilbage selvom de er tomme, 
                        //men så ved frontend at backend er færdig og den kan lave en getrequest til login.
                        console.log("VIRKSOMHED ER SKABT");
                        errors.areThereErrors="false";
                        res.send(errors);
                    });
                });
             }
            else {
                res.send(errors);
            }
        })
    })
});

router.post('/delete', function (req, res) {
    deleteVirksomhed("")
    res.redirect('back');
});



router.post('/studentCreate', (req, res, next)=> {
    console.log('post')
     // Indlæs variable fra viewet
     let jsonBody = JSON.parse(req.body);
     console.log(jsonBody)
     let email = jsonBody.email;
     let gentagEmail = jsonBody.gentagEmail;
     let password = jsonBody.password;
     let gentagPassword = jsonBody.gentagPassword;
     let tlfnr = jsonBody.tflnr;
     let fornavn = jsonBody.fornavn;
     let efternavn = jsonBody.efternavn;
     let dato = jsonBody.dato;

     //reset errors
     let atLeastOneErrorIsPresent = false;
     let errors = {
        areThereErrors: "true",
        EmailError: "",
        PasswordError: "",
        TlfnrError: "",
        ByError: "",
        forError: "",
        efterError: "",
        datoError: ""
        
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
    if (!validatePhone(tlfnr)) {
        errors.TlfnrError = "Telefonnummer er ugyldigt";
        atLeastOneErrorIsPresent = true;
    }
    if(!validateNavn(fornavn)) {
        errors.forError = "Fornavet skal være større end 1"
        atLeastOneErrorIsPresent = true;
    }
    if(!validateNavn(efternavn)) {
        errors.efterError = "Efternavet skal være større end 1"
        atLeastOneErrorIsPresent = true;
    }

    findUserByEmail(email).then((userFoundByEmail) => {
        let aUserExistsWithThatEmail = false;
        if (userFoundByEmail !== null) {
            errors.EmailError = "Email findes allerede i systemet";
            aUserExistsWithThatEmail = true;
            atLeastOneErrorIsPresent = true;
        }
            if(!atLeastOneErrorIsPresent) {
                hashPassword(password).then((hashedPassword) => {
                    let studentBruger = {
                        email: email,
                        fornavn: fornavn,
                        efternavn: efternavn,
                        password: hashedPassword,
                        tlfnr: tlfnr,
                        foedselsdato: dato,

                    }
                    createStudent(studentBruger).then(()=>{ //create student istedet
                        //vi sender errors tilbage selvom de er tomme, 
                        //men så ved frontend at backend er færdig og den kan lave en getrequest til login.
                        console.log("STUdentent ER SKABT");
                        errors.areThereErrors="false";
                        res.send(errors);
                    });
                });
             }
            else {
                res.send(errors);
            }
        
    })

})
module.exports = router;