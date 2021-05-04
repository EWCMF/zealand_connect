const express = require('express');
const router = express.Router();
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const editVirksomhed = require('../persistence/usermapping').editVirksomhed;
const editStudent = require('../persistence/usermapping').editStudent;
const editPassword = require('../persistence/usermapping').editPassword;
const deleteStudent = require('../persistence/usermapping').deleteStudent;
const deleteVirksomhed = require('../persistence/usermapping').deleteVirksomhed;
const hbs = require('handlebars');
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
const {
    emailRegex
} = require('../constants/regex');
const passport = require('passport');

router.get('/', authorizeUser('student', 'company', 'admin'), function (req, res, next) {
    findUserByEmail(req.user).then((user) => {
        if (user instanceof models.Virksomhed) {
            let loggedInVirksomhed = {
                email: user.email,
                cvrnr: user.cvrnr,
                navn: user.navn,
                adresse: user.adresse,
                tlfnr: user.tlfnr,
                hjemmeside: user.hjemmeside,
                land: user.land,
                postnr: user.postnr,
                by: user.by,
                logo: user.logo,
                visible_mail: user.visible_mail,
                description: user.description,
                ejer: true,
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
            res.render("studentprofil", {
                language: reqLang(req, res),
                loggedInUser
            });
        }
    });
});

router.get('/virksomhed/:id', async function (req, res) {
    let id = req.params.id;

    if (res.locals.user instanceof models.Virksomhed) {
        if (res.locals.user.id == id) {
            return res.redirect('/profil')
        }
    }

    let json = await models.Virksomhed.findByPk(id, {
        raw: true,
        nest: true,
    });

    let loggedInVirksomhed = {
        id: json.id,
        email: json.email,
        cvrnr: json.cvrnr,
        navn: json.navn,
        adresse: json.adresse,
        tlfnr: json.tlfnr,
        hjemmeside: json.hjemmeside,
        land: json.land,
        postnr: json.postnr,
        by: json.by,
        logo: json.logo,
        visible_mail: json.visible_mail,
        description: json.description,
    };

    let data = await getPosts(res, id, req.query.page);

    let count = data.count;
    let page = data.page;
    let pageCount = data.pageCount;
    let rows = data.rows;
    let favouritePosts = data.favouritePosts

    let withPages = pageCount > 1 ? true : false;

    res.render('visprofil', {
        language: reqLang(req, res),
        loggedInVirksomhed,
        json: rows,
        pagination: {
            page: page,
            pageCount: pageCount
        },
        withPages,
        favouritePosts: favouritePosts,
        inProfile: true
    });
});

router.post('/virksomhed/:id/query', async function (req, res) {
    let formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        let id = req.params.id;
        let fetchedData = await getPosts(res, id, fields.page);

        let count = fetchedData.count;
        let page = fetchedData.page;
        let pageCount = fetchedData.pageCount;
        let rows = fetchedData.rows;

        let item = [count];

        fs.readFileAsync = function (filename) {
            return new Promise(function (resolve, reject) {
                fs.readFile(filename, function (err, data) {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            });
        };

        function getFile(filename) {
            return fs.readFileAsync(filename, 'utf8');
        }

        getFile(path.normalize('views/partials/search-praktik-card.hbs')).then((data) => {
            hbs.registerHelper('ifCond', function(v1, operator, v2, options){
                switch (operator) {
                    case '==':
                        return (v1 == v2) ? options.fn(this) : options.inverse(this);
                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (v1 != v2) ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            });
            let template = hbs.compile(data + '');
            let html = template({
                json: rows,
                isStudent: res.locals.isStudent,
                inProfile: true
            }, {
                allowProtoPropertiesByDefault: true
            });
            item.push(html);

            getFile(path.normalize('views/partials/search-pagination.hbs')).then((data) => {
                hbs.registerHelper('paginate', require('handlebars-paginate'));
                let template = hbs.compile(data + '');

                let withPages = pageCount > 1 ? true : false;

                let html = template({
                    pagination: {
                        page: page,
                        pageCount: pageCount
                    },
                    withPages,
                });

                item.push(html);
                res.send(item);
            });
        })
    });
});

async function getPosts(res, id, page) {
    let offset;
    let limit = 5;
    if (!page) {
        page = 1
        offset = 0;
    } else {
        offset = (page - 1) * limit;
    }

    const {
        count,
        rows
    } = await models.InternshipPost.findAndCountAll({
        where: {
            fk_company: id
        },
        limit: limit,
        nest: true,
        distinct: true,
        offset: offset,
        order: [
            ['updatedAt', 'DESC']
        ],
        include: [
            {
                model: models.Virksomhed,
                as: 'virksomhed'
            },
            {
                model: models.Uddannelse,
                attributes: ['name'],
                through: models.InternshipPost_Education,
            },
        ],
    });

    let favouritePosts = [];
    if (res.locals.user instanceof models.Student) {
        favouritePosts = await models.FavouritePost.findAll({
            raw: true,
            where: {
                student_id: res.locals.user.id
            }
        })
    }

    let pageCount = Math.ceil(count / limit);

    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        if (element['post_start_date'].length > 0) {
            let cropStart = element['post_start_date'].substring(0, 10);

            let startYear = cropStart.substring(0, cropStart.indexOf('-'));
            let startMonth = cropStart.substring(cropStart.indexOf('-') + 1, cropStart.lastIndexOf('-'));
            let startDay = cropStart.substring(cropStart.lastIndexOf('-') + 1);

            element['post_start_date'] = startDay + '/' + startMonth + '/' + startYear;
        }

        if (element['post_end_date'] != null && element['post_end_date'].length > 0) {
            let cropEnd = element['post_end_date'].substring(0, 10);

            let endYear = cropEnd.substring(0, cropEnd.indexOf('-'));
            let endMonth = cropEnd.substring(cropEnd.indexOf('-') + 1, cropEnd.lastIndexOf('-'));
            let endDay = cropEnd.substring(cropEnd.lastIndexOf('-') + 1);
            element['post_end_date'] = endDay + '/' + endMonth + '/' + endYear;
        }

        switch (element['post_type']) {
            case 1:
                element['post_type'] = 'Praktik';
                break;
            case 2:
                element['post_type'] = 'Studiejob';
                break;
            case 3:
                element['post_type'] = 'Trainee stilling';
                break;
            case 4:
                element['post_type'] = 'Fuldtidsstilling';
        }

        favouritePosts.forEach(favouritePost => {
            if (favouritePost.internship_post_id === element.id) {
                element['isFavourite'] = true;
            }
        });
    }

    return {
        count: count,
        page: page,
        pageCount: pageCount,
        rows: rows,
        favouritePosts: favouritePosts
    };
}

router.get('/rediger', authorizeUser('student', 'company', 'admin'), function (req, res, next) {
    let errors = req.query;
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
                land: user.land,
                postnr: user.postnr,
                by: user.by,
                logo: user.logo,
                visible_mail: user.visible_mail,
                description: user.description
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
                LandError: errors.LandError,
                LogoError: errors.LogoError,
                language: reqLang(req),
                loggedInVirksomhed
            });
        }
    });
});

router.post('/redigerstudent-save', authorizeUser('student', 'admin'), function (req, res) {
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
            tlfnr,
            by,
            postnr,
            cvrnr,
            navn,
            adresse,
            hjemmeside,
            land,
            logo,
            crop_base64,
            visibleMail,
            description
        } = fields;
        let content = {
            email,
            tlfnr,
            by,
            postnr,
            cvrnr,
            navn,
            adresse,
            hjemmeside,
            land,
            logo,
            crop_base64,
            visibleMail,
            description
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

router.get('/getUser', authorizeUser('student', 'company', 'admin'), function (req, res, next) {
    findUserByEmail(req.user).then((user) => {
        res.send(user);
    })
});

router.post('/change-password-student', authorizeUser('student', 'admin'), async function (req, res, next) {
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

        let student = await models.Student.findByPk(id, {
            raw: true,
            attributes: ["password"]
        });

        let passwordFromDb = student.password;

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

        models.Student.update({
            password: await hashPassword(newPass)
        }, {
            where: {
                id: id
            }
        });

        res.status(200).send('ok');
    });

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

router.post('/change-email-company', authorizeUser('company', 'admin'), async function (req, res, next) {
    const {
        verifyPassword
    } = require('../encryption/password');

    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        let email = fields.nyEmail;
        let repeatEmail = fields.gentagEmail;
        let password = fields.emailPassword;

        req.body.email = email;
        req.body.password = password;

        if (!emailRegex.test(email)) {
            return res.status(400).send("errorInvalidEmail");
        }

        if (email !== repeatEmail) {
            return res.status(400).send("errorNotSame");
        }

        let checkEmail = await findUserByEmail(email);
        if (checkEmail) {
            return res.status(400).send("errorEmailNotAvailable");
        }

        let id = res.locals.user.id;

        let virksomhed = await models.Virksomhed.findByPk(id, {
            raw: true,
            attributes: ["password"]
        });

        if (!verifyPassword(password, virksomhed.password)) {
            return res.status(400).send("errorIncorrectPassword");
        }

        await models.Virksomhed.update({
            email: email
        }, {
            where: {
                id: id
            }
        });

        passport.authenticate('local', function (err, user, info) {
            //handle error
            //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.

            req.logout();

            //login skal være der for, at passport laver en cookie for brugeren
            req.logIn(user, async function (err) {
                if (err) {
                    return next(err);
                }

                return res.status(200).end();
            });
        })(req, res, next);
    });

});

router.post('/change-email-student', authorizeUser('student', 'admin'), async function (req, res, next) {
    const {
        verifyPassword
    } = require('../encryption/password');

    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        let email = fields.nyEmail;
        let repeatEmail = fields.gentagEmail;
        let password = fields.emailPassword;

        req.body.email = email;
        req.body.password = password;

        if (!emailRegex.test(email)) {
            return res.status(400).send("errorInvalidEmail");
        }

        if (email !== repeatEmail) {
            return res.status(400).send("errorNotSame");
        }

        let checkEmail = await findUserByEmail(email);
        if (checkEmail) {
            return res.status(400).send("errorEmailNotAvailable");
        }

        let id = res.locals.user.id;

        let student = await models.Student.findByPk(id, {
            raw: true,
            attributes: ["password"]
        });

        if (!verifyPassword(password, student.password)) {
            return res.status(400).send("errorIncorrectPassword");
        }

        await models.Student.update({
            email: email
        }, {
            where: {
                id: id
            }
        });

        passport.authenticate('local', function (err, user, info) {
            //handle error
            //Der var ikke nogle fejl så den gamle cookie skal stoppes. ellers kan den nye cookie ikke oprettes.

            req.logout();

            //login skal være der for, at passport laver en cookie for brugeren
            req.logIn(user, async function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).end();
            });
        })(req, res, next);
    });

});

router.post('/delete-account', authorizeUser('student', 'company'), async function (req, res, next) {
    const {
        verifyPassword
    } = require('../encryption/password');

    let formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {
        let errors = [];
        let password = fields.password;
        let id = res.locals.user.id;

        let user = null;

        if (res.locals.isStudent) {
            user = await models.Student.findByPk(id, {
                attributes: ["password", "email"]
            });
        } else if (res.locals.isCompany) {
            user = await models.Virksomhed.findByPk(id, {
                attributes: ["password", "email"]
            });
        }

        if (user) {
            let passwordFromDb = user.password;

            if (!await verifyPassword(password, passwordFromDb)) {
                errors.push(1);
            }

            if (errors.length > 0) {
                return res.status(400).send(JSON.stringify(errors));
            }

            if (user instanceof models.Student) {
                await deleteStudent(user.email)
            } else if (user instanceof models.Virksomhed) {
                await deleteVirksomhed(user.email)
            }

            req.logout();
            res.status(200).send('ok');
        } else {
            res.status(404);
        }
    });

});

function unlinkOldFiles(filename) {
    fs.unlink(uploadFolder + filename, (err) => {
        if (err) throw err
        console.log(filename + " was deleted")
    });
}

module.exports = router;