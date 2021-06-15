const express = require('express');
const {findUserByCVR} = require('../persistence/usermapping');
const router = express.Router();
const {reqLang} = require('../public/javascript/request');
const createVirksomhed = require('../persistence/usermapping').createVirksomhed;
const createStudent = require('../persistence/usermapping').createStudent;
const createProfessor = require('../persistence/usermapping').createProfessor;
const hashPassword = require('../encryption/password').hashPassword;
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const findVirksomhedByCvr = require('../persistence/usermapping').findVirksomhedByCvr;
const {
    validateEmail, validateCVR, validatePhone, validateCity, validatePasswordLength, validateCvrLength,
    checkForIdenticals, validatePostcode, validateNavn
} = require('../validation/input-validation');

router.get('/', function (req, res, next) {

    let studentChecked;
    let companyChecked;

    if (req.query.usertype) {
        if (req.query.usertype === '1') {
            studentChecked = '';
            companyChecked = 'checked';
        } else {
            studentChecked = 'checked';
            companyChecked = '';
        }  
    } else {
        studentChecked = '';
        companyChecked = 'checked';
    } 

    res.render('opret-bruger', {
        studentChecked,
        companyChecked,
        language: reqLang(req)
    });
});

router.post('/check-email', async (req, res) => {
    console.log("test 500")

    let email = req.body;

    console.log("test 501")

    let exists = await findUserByEmail(email);

    console.log("test 502")

    if (exists == null) {
        return res.json({"email": "valid"});
    }

    res.json({"email": "invalid"});
});

router.post('/check-cvr', async (req, res) => {
    let cvr = req.body;

    let exists = await findVirksomhedByCvr(cvr);

    if (exists == null) {
        return res.json({"cvr": "valid"});
    }

    res.json({"cvr": "invalid"});
});

router.post('/create', (req, res) => {
    // Indlæs variable fra viewet
    let jsonBody = JSON.parse(req.body);
    let email = jsonBody.email;
    let gentagEmail = jsonBody.gentagEmail;
    let password = jsonBody.password;
    let gentagPassword = jsonBody.gentagPassword;
    let virksomhedNavn = jsonBody.virksomhedNavn;
    let tlfnr = jsonBody.tflnr;
    let by = jsonBody.by;
    let postnr = jsonBody.postnr;
    let cvrnr = jsonBody.cvrnr;
    let consent = jsonBody.consent;

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
        consentError: ""
    }
    // valider
    if (!consent){
        errors.consentError = "Manglende samtykke";
        atLeastOneErrorIsPresent = true
    }
    if (!validateEmail(email)) {
        errors.EmailError = "Email er ugyldig";
        atLeastOneErrorIsPresent = true;
        console.log("email issue 1")
    } else if (!checkForIdenticals(email, gentagEmail)) {
        errors.EmailError = "Email er ikke ens";
        atLeastOneErrorIsPresent = true;
        console.log("email issue 2")
    }

    if (!validatePasswordLength(password)) {
        errors.PasswordError = "Adgangskode skal være mellem 8 og 20 tegn";
        atLeastOneErrorIsPresent = true;
        console.log("password issue 1")
    } else if (!checkForIdenticals(password, gentagPassword)) {
        console.log("password issue 2")
        errors.PasswordError = "Passwords er ikke ens";
        atLeastOneErrorIsPresent = true;
    }

    if (!validateNavn(virksomhedNavn)) {
        atLeastOneErrorIsPresent = true;
        console.log("navn issue")
    }

    if (!validateCVR(cvrnr)) {
        errors.CVRError = "CVR-nummer er ugyldigt";
        atLeastOneErrorIsPresent = true;
        console.log("cvr issue 1")
    } else if (!validateCvrLength(cvrnr)) {
        errors.CVRError = "CVR-nummer skal være 8 cifre";
        atLeastOneErrorIsPresent = true;
        console.log("cvr issue 2")
    }

    if (!validatePhone(tlfnr)) {
        errors.TlfnrError = "Telefonnummer er ugyldigt";
        atLeastOneErrorIsPresent = true;
    }

    if (!validateCity(by)) {
        errors.ByError = "By er ugyldig";
        atLeastOneErrorIsPresent = true;
    }

    if (!validatePostcode(postnr)) {
        errors.PostnrError = "Postnummer er ugyldig";
        atLeastOneErrorIsPresent = true;
    }

    findUserByEmail(email).then((userFoundByEmail) => {
        let aUserExistsWithThatEmail = false;
        if (userFoundByEmail !== null) {
            errors.EmailError = "Email findes allerede i systemet";
            aUserExistsWithThatEmail = true;
            atLeastOneErrorIsPresent = true;
        }
        if (!atLeastOneErrorIsPresent) {
            hashPassword(password).then((hashedPassword) => {
                let virksomhedsBruger = {
                    email: email,
                    password: hashedPassword,
                    tlfnr: tlfnr,
                    by: by,
                    postnr: postnr,
                    cvrnr: cvrnr,
                    navn: virksomhedNavn,
                    user_data_consent: consent
                }
                createVirksomhed(virksomhedsBruger).then(() => {
                    //vi sender errors tilbage selvom de er tomme,
                    //men så ved frontend at backend er færdig og den kan lave en getrequest til login.
                    errors.areThereErrors = "false";
                    res.send(errors);
                });
            });
        } else {
            res.send(errors);
        }
    })
});

router.post('/studentCreate', (req, res, next) => {
    // Indlæs variable fra viewet
    let jsonBody = JSON.parse(req.body);
    let email = jsonBody.email;
    let gentagEmail = jsonBody.gentagEmail;
    let password = jsonBody.password;
    let gentagPassword = jsonBody.gentagPassword;
    let tlfnr = jsonBody.tflnr;
    let fornavn = jsonBody.fornavn;
    let efternavn = jsonBody.efternavn;
    let dato = jsonBody.dato;
    let consent = jsonBody.consent;

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
        datoError: "",
        consentError: ""

    }
    // valider
    if (!consent){
        errors.consentError = "Manglende samtykke";
        atLeastOneErrorIsPresent = true
    }
    if (!validateEmail(email)) {
        errors.EmailError = "Email er ugyldig";
        atLeastOneErrorIsPresent = true;
    } else if (!checkForIdenticals(email, gentagEmail)) {
        errors.EmailError = "Email er ikke ens";
        atLeastOneErrorIsPresent = true;
    }

    if (!validatePasswordLength(password)) {
        errors.PasswordError = "Adgangskode skal være mellem 8 og 20 tegn";
        atLeastOneErrorIsPresent = true;
    } else if (!checkForIdenticals(password, gentagPassword)) {
        errors.PasswordError = "Passwords er ikke ens";
        atLeastOneErrorIsPresent = true;
    }
    if (!validatePhone(tlfnr)) {
        errors.TlfnrError = "Telefonnummer er ugyldigt";
        atLeastOneErrorIsPresent = true;
    }
    if (!validateNavn(fornavn)) {
        errors.forError = "Fornavet skal være større end 1"
        atLeastOneErrorIsPresent = true;
    }
    if (!validateNavn(efternavn)) {
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
        if (!atLeastOneErrorIsPresent) {
            hashPassword(password).then((hashedPassword) => {
                let studentBruger = {
                    email: email,
                    fornavn: fornavn,
                    efternavn: efternavn,
                    password: hashedPassword,
                    tlfnr: tlfnr,
                    foedselsdato: dato,
                    user_data_consent: consent

                }
                createStudent(studentBruger).then(() => { //create student istedet
                    //vi sender errors tilbage selvom de er tomme,
                    //men så ved frontend at backend er færdig og den kan lave en getrequest til login.
                    errors.areThereErrors = "false";
                    res.send(errors);
                });
            });
        } else {
            res.send(errors);
        }

    })

})

router.post('/professorCreate', (req, res, next) => {
    // Indlæs variable fra viewet
    let jsonBody = JSON.parse(req.body);
    let email = jsonBody.email;
    let gentagEmail = jsonBody.gentagEmail;
    let password = jsonBody.password;
    let gentagPassword = jsonBody.gentagPassword;
    let fornavn = jsonBody.fornavn;
    let efternavn = jsonBody.efternavn;
    let consent = jsonBody.consent;

    //reset errors
    let atLeastOneErrorIsPresent = false;
    let errors = {
        areThereErrors: "true",
    }

    // valider
    if (!consent){
        atLeastOneErrorIsPresent = true
    }
    if (!validateEmail(email)) {
        atLeastOneErrorIsPresent = true;
    } else if (!checkForIdenticals(email, gentagEmail)) {
        atLeastOneErrorIsPresent = true;
    }

    if (!validatePasswordLength(password)) {
        atLeastOneErrorIsPresent = true;
    } else if (!checkForIdenticals(password, gentagPassword)) {
        atLeastOneErrorIsPresent = true;
    }

    if (!validateNavn(fornavn)) {
        atLeastOneErrorIsPresent = true;
    }
    if (!validateNavn(efternavn)) {
        atLeastOneErrorIsPresent = true;
    }

    findUserByEmail(email).then((userFoundByEmail) => {
        if (userFoundByEmail !== null) {
            atLeastOneErrorIsPresent = true;
        }
        if (!atLeastOneErrorIsPresent) {
            hashPassword(password).then((hashedPassword) => {
                let professorBruger = {
                    email: email,
                    fornavn: fornavn,
                    efternavn: efternavn,
                    password: hashedPassword,
                    user_data_consent: consent

                }
                createProfessor(professorBruger).then(() => {
                    errors.areThereErrors = "false";
                    res.send(errors);
                });
            });
        } else {
            res.send(errors);
        }
    })

})

module.exports = router;