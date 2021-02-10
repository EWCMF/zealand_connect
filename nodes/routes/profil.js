const express = require('express');
const router = express.Router();
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const editVirksomhed = require('../persistence/usermapping').editVirksomhed;
const editStudent = require('../persistence/usermapping').editStudent;
const editPassword = require('../persistence/usermapping').editPassword;
const models = require("../models");
const uploadFolder = require("../constants/references").uploadFolder();
const formidable = require("formidable");
const imageSize = require('image-size');
const fs = require("fs");
const os = require('os');
const path = require('path');
const mv = require('mv');
const {
    reqLang
} = require('../public/javascript/request');
const checkForIdenticals = require('../validation/input-validation').checkForIdenticals;
const validatePasswordLength = require('../validation/input-validation').validatePasswordLength;
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;

router.get('/',  authorizeUser('student', 'company', 'admin'),function (req, res, next) {
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
                logo: user.logo,
                visible_mail: user.visible_mail,
                ejer: true
            }
            console.log(loggedInVirksomhed)
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
            res.render("studentprofil", {
                language: reqLang(req, res),
                loggedInUser
            });
        }
    });
});

router.get('/virksomhed/:id', async function (req, res) {
    let id = req.params.id;

    let json = await models.Virksomhed.findByPk(id, {
        raw: true
    });

    let loggedInVirksomhed = {
        email: json.email,
        cvrnr: json.cvrnr,
        navn: json.navn,
        adresse: json.adresse,
        tlfnr: json.tlfnr,
        hjemmeside: json.hjemmeside,
        direktoer: json.direktoer,
        land: json.land,
        postnr: json.postnr,
        by: json.by,
        logo: json.logo,
        visible_mail: json.visible_mail
    };

    res.render('visprofil', {
        language: reqLang(req, res),
        loggedInVirksomhed
    });
});

router.get('/rediger',  authorizeUser('student', 'company', 'admin'), function (req, res, next) {
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

            res.render("rediger-studentprofil", {
                language: reqLang(req, res),
                loggedInUser
            });

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
                by: user.by,
                logo: user.logo,
                visible_mail: user.visible_mail
            }
            //render with potential errors and information about the profile
            res.render("rediger-virksomhedsprofil", {
                language: reqLang(req, res),
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
                logo: user.logo,
                language: reqLang(req),
                loggedInVirksomhed
            });
        }
    });
});

router.post('/redigerstudent-save',  authorizeUser('student', 'admin'), function (req, res) {
    let formData = new formidable.IncomingForm();

    formData.parse(req, async function (error, fields, files) {
        //laver et objekt med alle data
        const {
            email,
            fornavn,
            efternavn,
            telefon,
            profile_picture,
            crop_base64,
            password,
            gentagPassword
        } = fields;
        let content = {
            email,
            fornavn,
            efternavn,
            telefon,
            profile_picture,
            crop_base64,
            password,
            gentagPassword
        };

        const imageBufferData = Buffer.from(crop_base64, 'base64');

        let size = Buffer.byteLength(imageBufferData);

        if (size > 0) {
            /*fileUpload here*/
            let img = files.profile_picture;

            const imgData = imageSize(imageBufferData);

            //Stien til upload mappen skal være til stien i docker containeren.
            // VIRKER IKKE PÅ WINDOWS
            let publicUploadFolder = uploadFolder;

            //Generere unik data til filnavn med Date.now() og tilfældig tal.
            let datetime = Date.now();
            let randomNumber = Math.floor(Math.random() * (10 - 0 + 1) + 0);

            //Kombinere oprindelig filnavn med unik data for at lave unike filnavne.
            let newPicName = datetime + randomNumber + "_" + img.name;

            if (imgData.width >= 250 && imgData.height >= 250) {
                if (size <= 10000000) {
                    //Når filer bliver uploaded bliver de lagt i en midlertigt mappe med tilfældignavn.
                    //Nedenstående flytter og omdøber filer på sammetid
                    if (img.type === "image/jpeg" || img.type === "image/png" || img.type === "image/svg+xml" || img.type === "image/bmp") {
                        let tempPath = path.join(os.tmpdir(), Date.now() + '');

                        //Gemmer buffer til en midlertidig fil i temp mappen med tilfældigt navn.
                        //Dette er nødvendigt da man ikke kan bruge mv med buffer dataen direkte.
                        fs.writeFileSync(tempPath, imageBufferData, function (err) {
                            if (err) {
                                return res.error(err);
                            }
                        });

                        mv(tempPath, publicUploadFolder + newPicName, (errorRename) => {
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
                                if (password && password === gentagPassword && validatePasswordLength(password) && checkForIdenticals(password, gentagPassword)) {
                                    editPassword(email, password);
                                    //TODO: Error handling here and change password for companies
                                }
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
                console.log("Invalid image dimensions");
                res.redirect('/profil/rediger');
            }
        } else {
            // Intet profilbillede, så nøjes med at opdatere de andre felter
            if (password && password === gentagPassword) {
                editPassword(email, password);
            }
            editStudent(email, fornavn, efternavn, telefon);
            res.redirect('/profil/rediger');
        }
    });
});

router.post('/rediger-save', authorizeUser('company', 'admin'), function (req, res, next) {
    let formData = new formidable.IncomingForm();

    formData.parse(req, async function (error, fields, files) {
        //laver et objekt med alle data
        const {
            email,
            telefon,
            by,
            postnr,
            cvrnr,
            navn,
            adresse,
            hjemmeside,
            direktoer,
            land,
            logo,
            crop_base64,
            visibleMail
        } = fields;
        let content = {
            email,
            telefon,
            by,
            postnr,
            cvrnr,
            navn,
            adresse,
            hjemmeside,
            direktoer,
            land,
            logo,
            crop_base64,
            visibleMail
        };

        const imageBufferData = Buffer.from(crop_base64, 'base64');

        let size = Buffer.byteLength(imageBufferData);

        if (size > 0) {
            /*fileUpload here*/
            let img = files.logo;

            const imgData = imageSize(imageBufferData);

            //Stien til upload mappen skal være til stien i docker containeren.
            // VIRKER IKKE PÅ WINDOWS
            let publicUploadFolder = uploadFolder;

            //Generere unik data til filnavn med Date.now() og tilfældig tal.
            let datetime = Date.now();
            let randomNumber = Math.floor(Math.random() * (10 - 0 + 1) + 0);

            //Kombinere oprindelig filnavn med unik data for at lave unike filnavne.
            let newPicName = datetime + randomNumber + "_" + img.name;

            if (imgData.width >= 250 && imgData.height >= 250) {
                if (size <= 10000000) {
                    //Når filer bliver uploaded bliver de lagt i en midlertigt mappe med tilfældignavn.
                    //Nedenstående flytter og omdøber filer på sammetid
                    if (img.type === "image/jpeg" || img.type === "image/png" || img.type === "image/svg+xml" || img.type === "image/bmp") {
                        let tempPath = path.join(os.tmpdir(), Date.now() + '');

                        //Gemmer buffer til en midlertidig fil i temp mappen med tilfældigt navn.
                        //Dette er nødvendigt da man ikke kan bruge mv med buffer dataen direkte.
                        fs.writeFileSync(tempPath, imageBufferData, function (err) {
                            if (err) {
                                return res.error(err);
                            }
                        });

                        mv(tempPath, publicUploadFolder + newPicName, (errorRename) => {
                            if (errorRename) {
                                console.log("Unable to move file.");
                            } else {
                                models.Virksomhed.findOne({
                                    where: {
                                        email: email
                                    }
                                }).then(result => {
                                    if (result.logo !== null) {
                                        // Search the directory for the old profile picture
                                        fs.readdir(uploadFolder, function (err, list) {
                                            if (err) throw err;
                                            for (let i = 0; i < list.length; i++) {
                                                // If the old profile picture exists, delete it
                                                if (list[i] === result.logo) {
                                                    unlinkOldFiles(result["logo"])
                                                }
                                            }
                                        });
                                    }
                                }).catch();
                                content.logo = newPicName;

                                // Edit the students information
                                editVirksomhed(content);
                                //TODO opdater editVirksomhed
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
            // Intet logo, så nøjes med at opdatere de andre felter
            editVirksomhed(content);
            res.redirect('/profil/rediger');
        }
    });
});

router.get('/getUser',  authorizeUser('student', 'company', 'admin'), function (req, res, next) {
    findUserByEmail(req.user).then((user) => {
        res.send(user);
    })
});

router.post('/change-password-company', authorizeUser('company', 'admin'), async function (req, res, next) {
    const {
        hashPassword,
        verifyPassword
    } = require('../encryption/password');

    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        let oldPass = fields.gamlePassword;
        let newPass = fields.nytPassword;
        let repeatPass = fields.gentagNytPassword;

        let errors = [];

        let id = res.locals.user.id;

        let virksomhed = await models.Virksomhed.findByPk(id, {
            raw: true,
            attributes: ["password"]
        });

        let passwordFromDb = virksomhed.password;

        if (!await verifyPassword(oldPass, passwordFromDb)) {
            errors.push(1);
        }

        if (!validatePasswordLength(newPass)) {
            errors.push(2);
        }

        if (!checkForIdenticals(newPass, repeatPass)) {
            errors.push(3);
        }

        if (errors.length > 0) {
            return res.status(400).send(JSON.stringify(errors));
        }

        models.Virksomhed.update({
            password: await hashPassword(newPass)
        }, {
            where: {
                id: id
            }
        });

        res.status(200).send('ok');
    });

});

function unlinkOldFiles(filename) {
    fs.unlink(uploadFolder + filename, (err) => {
        if (err) throw err
        console.log(filename + " was deleted")
    });
}

module.exports = router;