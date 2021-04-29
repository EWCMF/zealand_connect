const express = require('express');
const router = express.Router();
const {deleteVirksomhed, searchVirksomhederByName, findStudentByName} = require('../persistence/usermapping');
const deleteCV = require('../persistence/cv-mapping').deleteCV;
const {reqLang} = require('../public/javascript/request');
const {createUddanelse, findUddannelseByName, sletUddannelse} = require('../persistence/uddanelsemapping');
const deleteInternshipPost = require('../persistence/internship_post_mapping').deleteInternshipPost;
const deleteStudent = require('../persistence/usermapping').deleteStudent;
const passport = require('passport');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;
const models = require("../models");
const mailer = require('../utils/mail-sender');

router.get('/', authorizeUser('admin'), function (req, res, next) {
    // Hele authorization håndteres nu af en middleware function
    res.render('admin-funktioner', {language: reqLang(req, res)})
});

router.get('/login', function (req, res, next) {
    //check om logged in as admin
    let error = req.query;
    let msg = error.error;
    switch (msg) {
        case 'incorrectusername':
            res.render('login-admin', {errormessage: 'Email eller password er forkert'});
            break;
        case 'incorrectpassword':
            res.render('login-admin', {errormessage: 'Email eller password er forkert'});
            break;
        case 'notloggedin':
            res.render('login-admin', {errormessage: 'Du skal logge ind før du kan se din profil.'});
            break;
        case 'none':
            res.redirect('/admin-funktioner');
            break;
        default:
            res.render('login-admin');
            break;
    }
});

router.post('/login/authenticate', function (req, res, next) {
    //check om logged in as admin
    passport.authenticate('local', function (err, user, info) {
        //handle error
        if (!user) {
            return res.redirect('/admin-funktioner/login' + info.message);
        }
        //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.
        req.logout();
        //login skal være der for, at passport laver en cookie for brugeren
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/admin-funktioner/login' + info.message);
        });
    })(req, res, next);
});

router.post('/slet-bruger', authorizeUser('admin'), function (req, res, next) {
    let jsonBody = JSON.parse(req.body);
    let errorHappened = false;
    if (jsonBody.type == "virksomhed") {
        deleteVirksomhed(jsonBody.email).then((result) => {
            errorHappened = result;
            res.send('{"errorHappened":' + errorHappened + "}");
        });
    } else {
        deleteStudent(jsonBody.email).then((result) => {
            errorHappened = result;
            res.send('{"errorHappened":' + errorHappened + "}");
        });
    }
});


router.post('/createUddannelse', authorizeUser('admin'), (req, res, next) => {
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name

    let messages = {
        findesallerede: "",
        uddannelseOprettet: "",
        tomtnavn: ""
    }

    if (name === ""){
        messages.tomtnavn = "Feltet kan ikke være tomt";
        return res.send(messages);
    }

    findUddannelseByName(name).then((uddannelseFundetMedNavn) => {
        if (uddannelseFundetMedNavn !== null) { //hvis uddannelsen er i databasen
            messages.findesallerede = "Uddannelsen findes allerede"
            res.send(messages)
        } else { // hvis uddannelsen ikke er i databasen
            createUddanelse(name);
            messages.uddannelseOprettet = `Uddannelsen ${name} oprettet`
            res.send(messages)
        }
    })
});

router.post('/sletUddannelse', authorizeUser('admin'), (req, res, next) => {
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name;
    let messages = {
        findesIkke: "",
        uddannelseSlettet: ""
    }

    findUddannelseByName(name).then((uddannelseFundetMedNavn) => {
        if (uddannelseFundetMedNavn === null) {
            messages.findesIkke = "Uddannelsen findes ikke"
            res.send(messages);
        } else {
            sletUddannelse(name)
            messages.uddannelseSlettet = `Uddannelsen ${name} slettet`
            res.send(messages)
        }
    })
});

router.post('/search-virksomhed', authorizeUser('admin'), async (req, res) => {
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name;

    let data = await searchVirksomhederByName(name);

    res.send(data);
});

router.post('/search-student', authorizeUser('admin'), async (req, res) => {
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name;

    let data = await findStudentByName(name);

    res.send(data);
});

router.post('/delete-cv/:id', authorizeUser('admin'), async function (req, res, next) {
    let jsonBody = JSON.parse(req.body)
    let email = jsonBody.email
    let cvId = req.params.id;
    if (!cvId) {
        return res.status(400).json({message: "Angiv et ID for at slette et CV."})
    } else {
        let CV = await models.CV.findByPk(cvId);

        if (CV.email === email){
            deleteCV(cvId);
            return res.status(200).json({message: "CV'et med emailen " + email + " blev slettet. Du vil blive omdirigeret til CV-listen."})
        } else {
            return res.status(400).json({message: "Der findes intet CV med den email. Prøv igen."})
        }
    }
});

router.post('/delete-internship-post/:id', authorizeUser('admin'), async function (req, res, next) {
    let jsonBody = JSON.parse(req.body)
    let postTitle = jsonBody.postTitle
    let postId = req.params.id;
    if (!postId) {
        return res.status(400).json({message: "Angiv et ID for at slette et opslag."})
    } else {
        let internshipPost = await models.InternshipPost.findByPk(postId);
        if (internshipPost.title === postTitle){
            deleteInternshipPost(postId)
            return res.status(200).json({message: "Opslaget med overskriften '" + postTitle + "' blev slettet. Du vil blive omdirigeret til listen med opslag."})
        } else {
            return res.status(400).json({message: "Der findes intet opslag med den overskrift. Prøv igen."})
        }
    }
});

router.get('/delete-inactive-users', authorizeUser('admin'), async function (req, res){
    let students = await models.Student.findAll({
        raw: true,
        where: {
            last_login: null
        }
    })

    students.forEach(student => {
        deleteStudent(student.email)
    })

    res.json(students);
})


module.exports = router;