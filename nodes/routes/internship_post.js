var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; //Skal bruges til kalder API'er.
var sortJsonArray = require('sort-json-array'); //Brugt til at få byer i alfabetisk orden.
var formidable = require("formidable"); //Skal bruges når man håndtere filupload og alm. input i samme POST.
var fs = require("fs"); //Bruges til grundlæggen file hændtering.
var mv = require('mv'); //Skal bruges for kunne gemme uploads uden for container.
var uploadFolder = require('../constants/references').uploadFolder()
const {
    emailRegex,
    dateRegex,
    linkRegex,
    phoneRegex
} = require("../constants/regex.js");
const db = require('../models');
const {
    REPL_MODE_SLOPPY
} = require('repl');
const {
    Op
} = require('sequelize');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const models = require("../models");
var { reqLang } = require('../public/javascript/request');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;
const mailer = require('../utils/mail-sender');

router.post('/', authorizeUser('company', 'admin'), function (req, res, next) {
    //For at håndtere filupload og almindelige input data på tid skal man parse req igennem formidable.
    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error, fields, files) {
        //laver et objekt med alle data
        var {
            title,
            post_type,
            email,
            contact,
            educations,
            country,
            post_start_date,
            post_end_date,
            post_text,
            city,
            postcode,
            company_link,
            post_document,
            dawa_json,
            dawa_uuid,
            phone_number
        } = fields;

        educations = JSON.parse(educations);

        var region = '';
        
        if (country == '1' && postcode) {
            postcode = Number(postcode);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var json = JSON.parse(this.responseText);
                    region = json[0].adgangsadresse.region.navn;
                }
            };
            xmlhttp.open("GET", "https://dawa.aws.dk/adresser?id=" + dawa_uuid, false);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send();
        } else {
            // sæt adresse feltets data til tomme strings hvis der er valgt et andet land end danmark
            city = '';
            postcode = null;
            dawa_json = '';
            dawa_uuid = '';
        }
        
        var indhold = {
            title,
            post_type,
            email,
            contact,
            country,
            region,
            post_start_date,
            post_end_date,
            post_text,
            city,
            postcode,
            company_link,
            post_document,
            dawa_json,
            dawa_uuid,
            phone_number
        };
        
        var inputError = false;
        let brugernavn = res.locals.user == null || res.locals.user == undefined ? "ukendt bruger" : res.locals.user.email;
        let now = new Date();
        let dateTime = now.toLocaleDateString() + " " + now.toLocaleTimeString();
        let append = `user: ${brugernavn} time: ${dateTime}`
        let errors = "";
        
        //Test inputfelterne hvis javascript er deaktiveret af sikkerhedsmæssige årsager
        if (!title || title.length > 255) {
            console.log('Title length invalid ' +  append);
            errors += 'Title invalid or missing <br>';
            inputError = true;
        }
        
        if (!post_type) {
            console.log('Missing type ' +  append);
            errors += 'Missing type <br>';
            inputError = true;
        }
        
        if (!country) {
            console.log('Missing country ' +  append);
            errors += 'Missing country <br>';
            inputError = true;
        }
        
        // if (country == 1 && dawa_uuid == '') {
        //     console.log('Missing address ' +  append);
        //     errors += 'Missing address <br>';
        //     inputError = true;
        // }
        
        if (email) {
            if (email.length > 255) {
                console.log('Email too long ' +  append);
                errors += 'Email too long <br>';
                inputError = true;
            }
        
            if (!emailRegex.test(email)) {
                console.log('Invalid email ' +  append);
                errors += 'Invalid email <br>';
                inputError = true;
            }
        }
        
        if (phone_number) {
            if (phone_number.length > 255) {
                console.log('Phone number too long ' +  append);
                errors += 'Phone number too long <br>';
                inputError = true;
            }
        
            if (!phoneRegex.test(phone_number)) {
                console.log('Invalid phone number ' +  append);
                errors += 'Invalid phone number <br>';
                inputError = true;
            }
        }
        
        if (!contact || contact.length > 255) {
            console.log('Contact length invalid ' +  append);
            errors += 'Contact invalid or missing <br>';
            inputError = true;
        }
        
        if (post_start_date) {
            let currDate = new Date();
            let inputDate = new Date(post_start_date);
        
            if (currDate > inputDate) {
                console.log('Past date specified ' +  append);
                errors += 'Past date specified for internship start <br>';
                inputError = true;
            }
        }
        
        if (post_type == 1) {
            if (post_end_date.length > 0) {
                let currDate = new Date();
                let inputDate = new Date(post_end_date);
        
                if (currDate > inputDate) {
                    console.log('Past date ' +  append);
                    errors += 'Past date specified for application deadline <br>';
                    inputError = true;
                }
            }
        } else {
            indhold.post_end_date = null;
        }
        
        if (post_text.length > 65536) {
            console.log('Plain text is to long ' +  append);
            errors += 'Plain text is to long <br>';
            inputError = true;
        }
        
        if (company_link) {
            if (!linkRegex.test(company_link)) {
                console.log('Link Invalid ' +  append);
                errors += 'Link Invalid <br>';
                inputError = true;
            }
        } else {
            indhold.company_link = null;
        }
        
        if (educations.length <= 0) {
            console.log('Invalid education choice ' +  append);
            errors += 'Invalid education choice <br>';
            inputError = true;
        }
        
        //Database kode må først køre efter flyttelses og omdøb af uploadet filer er fuldført.
        async function dbExe() {
            //checkbox_state();
            if (!inputError) {
                let user = res.locals.user;
                let company_id = user.id;
        
                indhold.fk_company = company_id;
        
                const post = await db.InternshipPost.create(indhold).catch((error) => {
                    console.log(error);
                    return res.status(400).send(error);
                });

                for (const education of educations) {
                    await db.InternshipPost_Education.create({
                        post_id: post.id,
                        education_id: education
                    });
                }
                
                let ids = await db.CV_CVtype.findAll({
                    raw: true,
                    attributes: ['cv_id'],
                    where: {
                        cvtype_id: post_type
                    }
                });
        
                let idsArray = [];
                ids.forEach(element => {
                    idsArray.push(element.cv_id);
                });
        
                let cvs = await db.CV.findAll({
                    raw: true,
                    nest: true,
                    attributes: ['email', 'sprog'],
                    where: {
                        [Op.or]: {
                            id: idsArray
                        },
                        post_subscription: true,
                        fk_education: {
                            [Op.or]: educations
                        }
                    },
                    include: {
                        model: db.Student,
                        as: 'student'
                    }
                });
        
                for (const cv of cvs) {
                    let subject = "A new post has been made on Zealand Connect matching your preferences";
                    let dansk = false;
                    if (cv.sprog) {
                        if (cv.sprog.toLowerCase().includes('dansk')) {
                            subject = "Et nyt opslag er blevet lavet på Zealand Connect som matcher dine præferencer";
                            dansk = true;
                        }
                    }
        
                    let mailInfo = {
                        student: cv.student,
                        recipient: cv.email,
                        subject: subject,
                        context: {
                            studentName: `${cv.student.fornavn} ${cv.student.efternavn}`,
                            name: user.navn,
                            dansk: dansk,
                            link: process.env.DOMAIN + "/internship_view/" + post.id
                        }
                    }
                    try {
                        mailer.sendMail('subscription-mail', mailInfo)
                    }
                    catch (e){
                        console.log(e)
                        console.log(`Mail to student ${mailInfo.student.id} failed`)
                    }
                }
                res.redirect('../internship_view/' + post.id)
            } else {
                return res.status(422).render('errorInternship', {layout: false, errors: errors});
            }
        }
        
        if (files.post_document === null || files.post_document === undefined || files.post_document.size === 0) {
            dbExe();
        } else {
            /*fileUpload here*/
            var doc = files.post_document;
        
            //Stien til upload mappen skal være til stien i docker containeren.
            var publicUploadFolder = uploadFolder;
        
            //Generere unik data til filnavn med Date.now() og tilfældig tal.
            var datetime = Date.now();
        
            var randomNumber = Math.floor(Math.random() * (10 - 0 + 1) + 0);
        
            //Kombinere oprindelig filnavn med unik data for at lave unike filnavne.
            var newDocName = datetime + randomNumber + "_" + doc.name;
        
            if (doc.size <= 10240000) {
                //Når filer bliver uploaded bliver de lagt i en midlertigt mappe med tilfældignavn.
                //Nedenstående flytter og omdøber filer på sammetid
                if (doc.type == "text/plain" || doc.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || doc.type == "application/pdf" || doc.type == "application/msword") {
                    mv(doc.path, publicUploadFolder + newDocName, (errorRename) => {
        
                        if (errorRename) {
                            console.log("Unable to move file.");
                        } else {
                            indhold.post_document = newDocName;
                        }
                        dbExe();
                    });
                } else {
                    console.log("invalid file");
                    dbExe();
                }
            } else {
                console.log("invalid filesize");
                dbExe();
            }
        }
    });
});

router.get('/', authorizeUser('company', 'admin'), async function (req, res, next) {
    let loggedInVirksomhed;

    await findUserByEmail(req.user).then((user) => {
        loggedInVirksomhed = {
            email: user.email,
            cvrnr: user.cvrnr,
            navn: user.navn,
            adresse: user.adresse,
            tlfnr: user.tlfnr,
            hjemmeside: user.hjemmeside,
            land: user.land,
            postnr: user.postnr,
            by: user.by,
            logo: user.logo
        }
    });

    var generatedEducationOptions = '';

    const educations = await db.Uddannelse.findAll({
        order: [
            ['name', 'ASC']
        ]
    });

    res.render('internship_post', {
        language: reqLang(req, res),
        title: 'Opret opslag',
        educations: educations,
        profMail: loggedInVirksomhed.email,
        profWeb: loggedInVirksomhed.hjemmeside,
    });
})
;

module.exports = router;