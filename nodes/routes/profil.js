const express = require('express');
const router = express.Router();
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const editVirksomhed = require('../persistence/usermapping').editVirksomhed;
const editStudent = require('../persistence/usermapping').editStudent;
const models = require("../models");
const validation = require("../validation/input-validation");
const uploadFolder = require("../constants/references").uploadFolder;
const formidable = require("formidable");
const imageSize = require('image-size');
const fs = require("fs");
const path = require('path');
const mv = require('mv');
const {
    reqLang
} = require('../public/javascript/request');

router.get('/', function (req, res, next) {
    findUserByEmail(req.user).then((user) => {
        if (user instanceof models.Virksomhed) {
            let loggedInVirksomhed = {
                email: user.email,
                cvrnr: user.cvrnr,
                navn: user.navn,
                adresse: user.adresse,
                tlfnr: user.tlfnr,
                hjemmeside: user.hjemmeside,
                direktoer: user.direktoer,
                land: user.land,
                postnr: user.postnr,
                by: user.by,
            }
            res.render('visprofil', {
                language: reqLang(req, res),
                loggedInVirksomhed
            });
        } else if (user instanceof models.Student) {
            let loggedInUser = {
                email: user.email,
                fornavn: user.fornavn,
                efternavn: user.efternavn,
                tlfnr: user.tlfnr,
                profilbillede: user.profilbillede
            }
            res.render("studentprofil", {loggedInUser});
        }
    });
});

router.get('/rediger', function (req, res, next) {
    let errors = req.query;
    console.log("ERRORS");
    console.log(errors);
    //todo if Student render student else virksomhed
    //todo: find bruger og indsæt dens data i render hbs.
    findUserByEmail(req.user).then((user) => {
        if (user instanceof models.Student) {
            let loggedInUser = {
                email: user.email,
                fornavn: user.fornavn,
                efternavn: user.efternavn,
                tlfnr: user.tlfnr,
                profilbillede: user.profilbillede
            }

            res.render("rediger-studentprofil", {loggedInUser});

        } else {
            let loggedInVirksomhed = {
                email: user.email,
                cvrnr: user.cvrnr,
                navn: user.navn,
                adresse: user.adresse,
                tlfnr: user.tlfnr,
                hjemmeside: user.hjemmeside,
                direktoer: user.direktoer,
                land: user.land,
                postnr: user.postnr,
                by: user.by
            }
            //render with potential errors and information about the profile
            res.render("rediger-virksomhedsprofil", {
                succesBesked: req.query.succesBesked,
                fejlBesked: req.query.fejlBesked,
                EmailError: errors.EmailError,
                TlfnrError: errors.TlfnrError,
                ByError: errors.ByError,
                PostnrError: errors.PostnrError,
                CVRError: errors.CVRError,
                NavnError: errors.NavnError,
                AdresseError: errors.AdresseError,
                HjemmesideError: errors.HjemmesideError,
                DirektoerError: errors.DirektoerError,
                LandError: errors.LandError,
                LogoError: errors.LogoError,
                email: user.email,
                tlfnr: user.tlfnr,
                by: user.by,
                postnummer: user.postnr,
                cvr: user.cvrnr,
                firmanavn: user.navn,
                adresse: user.adresse,
                hjemmeside: user.hjemmeside,
                direktoer: user.direktoer,
                land: user.land,
                language: reqLang(req),
                loggedInVirksomhed
            });
        }
    });
});

router.post('/redigerstudent-save', function (req, res) {
    let formData = new formidable.IncomingForm();

    formData.parse(req, async function (error, fields, files) {
        //laver et objekt med alle data
        const {
            email, fornavn, efternavn, telefon, profile_picture
        } = fields;
        let content = {
            email, fornavn, efternavn, telefon, profile_picture
        };

        let inputError = false;

        if (files.profile_picture.size > 0) {
            /*fileUpload here*/
            let img = files.profile_picture;

            const imgData = imageSize(img.path);

            //Stien til upload mappen skal være til stien i docker containeren.
            // VIRKER IKKE PÅ WINDOWS
            let publicUploadFolder = uploadFolder;

            //Generere unik data til filnavn med Date.now() og tilfældig tal.
            let datetime = Date.now();
            let randomNumber = Math.floor(Math.random() * (10 - 0 + 1) + 0);

            //Kombinere oprindelig filnavn med unik data for at lave unike filnavne.
            let newPicName = datetime + randomNumber + "_" + img.name;

            if (imgData.width === imgData.height) {
                if (imgData.width >= 250 && imgData.height >= 250) {
                    if (img.size <= 1000000) {
                        //Når filer bliver uploaded bliver de lagt i en midlertigt mappe med tilfældignavn.
                        //Nedenstående flytter og omdøber filer på sammetid
                        if (img.type === "image/jpeg" || img.type === "image/png" || img.type === "image/svg+xml" || img.type === "image/bmp") {
                            await mv(img.path, publicUploadFolder + newPicName, (errorRename) => {
                                if (errorRename) {
                                    console.log("Unable to move file.");
                                } else {
                                    models.Student.findOne({
                                        where: {
                                            email: email
                                        }
                                    }).then(result => {
                                        if (result.profilbillede !== null) {
                                            // Search the directory for the old profile picture
                                            fs.readdir(uploadFolder, function (err, list) {
                                                if (err) throw err;
                                                for (let i = 0; i < list.length; i++) {
                                                    // If the old profile picture exists, delete it
                                                    if (list[i] === result.profilbillede) {
                                                        unlinkOldFiles(result["profilbillede"])
                                                    }
                                                }
                                            });
                                        }
                                    }).catch();
                                    content.profile_picture = newPicName;

                                    // Edit the students information
                                    editStudent(email, fornavn, efternavn, telefon, content.profile_picture);
                                    res.redirect('/profil/rediger');
                                }
                            });
                        } else {
                            console.log("invalid file");
                            res.redirect('/profil/rediger');
                        }
                    } else {
                        console.log("invalid filesize");
                        res.redirect('/profil/rediger');
                    }
                } else {
                    console.log("Invalid image dimensions")
                    res.redirect('/profil/rediger');
                }
            } else {
                console.log("Invalid aspect ratio")
                res.redirect('/profil/rediger');
            }
        } else {
            // Intet profilbillede, så nøjes med at opdatere de andre felter
            editStudent(email, fornavn, efternavn, telefon);
            res.redirect('/profil/rediger');
        }
    });
});

router.post('/rediger-save', function (req, res, next) {
    console.log("her er post requesten");
    console.log(req.body);
    //validate
    // Indlæs variable fra viewet
    let email = req.body.email;
    let tlfnr = req.body.telefon;
    let by = req.body.by;
    let postnr = req.body.postnr;
    let cvrnr = req.body.cvrnr;
    let firmanavn = req.body.navn;
    let adresse = req.body.address;
    let hjemmeside = req.body.hjemmeside;
    let direktoer = req.body.direkoer;
    let land = req.body.land;
    editVirksomhed(email, cvrnr, firmanavn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by);
    console.log(email, cvrnr, firmanavn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by);
    res.redirect('/profil')
    //todo logo
    // let errors = {
    //     EmailError: "",
    //     TlfnrError: "",
    //     ByError: "",
    //     PostnrError: "",
    //     CVRError: "",
    //     NavnError: "",
    //     AdresseError: "",
    //     HjemmesideError: "",
    //     DirektoerError: "",
    //     LandError: "",
    //     LogoError: "",
    // }
    // if (!validation.validateCVR(cvrnr)) {
    //     errors.CVRError = "Ugyldigt CVR";
    // } else if (!validation.validateCvrLength(cvrnr)) {
    //     errors.CVRError = "Ugyldigt CVR længde";
    // }

    // if (!validation.validatePhone(tlfnr)) {
    //     errors.TlfnrError = "Ugyldigt Telefonnummer";
    // }

    // if (!validation.validateCity(by)) {
    //     errors.ByError = "Ugyldig By";
    // }
    // //update the database if no erros present
    // let atLeastOneErrorIsPresent = false;
    // for (let value of Object.values(errors)) {
    //     console.log("error:");
    //     console.log(value);
    //     if (value != '') {
    //         //an error was here!
    //         atLeastOneErrorIsPresent = true;
    //         break;
    //     }
    // }
    // let succesBesked = '';
    // let fejlBesked = '';
    // if (!atLeastOneErrorIsPresent) {
    //     editVirksomhed(email, cvrnr, firmanavn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by);
    //     succesBesked = 'Succesfuldt opdateret brugeren';
    // } else {
    //     fejlBesked = 'Fejl ved opdatering af brugeren';
    // }
    // res.redirect('/profil/rediger?succesBesked=' + succesBesked + '&fejlBesked=' + fejlBesked + '&EmailError=' + errors.EmailError + '&TlfnrError=' + errors.TlfnrError + '&ByError=' + errors.ByError + '&PostnrError=' + errors.PostnrError + '&CVRError=' + errors.CVRError + '&NavnError=' + errors.NavnError + '&AdresseError=' + errors.AdresseError + '&HjemmesideError=' + errors.HjemmesideError + '&DirektoerError=' + errors.DirektoerError + '&LandError=' + errors.LandError + '&LogoError=' + errors.LogoError);
});

router.get('/getUser', function (req, res, next) {
    if (req.user != null) {
        findUserByEmail(req.user).then((user) => {
            res.send(user);
        });
    } else {
        res.send({
            email: ""
        });
    }
});


router.get('/getUser', function (req, res, next) {
    findUserByEmail(req.user).then((user) => {
        res.send(user);
    })
});

function unlinkOldFiles(filename) {
    fs.unlink(uploadFolder + filename, (err) => {
        if (err) throw err
        console.log(filename + " was deleted")
    });
}

module.exports = router;
