var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; //Skal bruges til kalder API'er.
var sortJsonArray = require('sort-json-array'); //Brugt til at få byer i alfabetisk orden.
var formidable = require("formidable"); //Skal bruges når man håndtere filupload og alm. input i samme POST.
var fs = require("fs");//Bruges til grundlæggen file hændtering.
var mv = require('mv');//Skal bruges for kunne gemme uploads uden for container.
const {emailRegex, dateRegex, linkRegex, numbersRegex} = require("../constants/regex.js");
const db = require('../models');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const models = require("../models");
const unlinkOldFiles = require('../utils/file-handling').unlinkOldFiles;
const deleteInternshipPost = require('../persistence/internship_post_mapping').deleteInternshipPost;
const uploadFolder = require('../constants/references').uploadFolder();
var {reqLang} = require('../public/javascript/request');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;

var tempDate = dateRegex.source;
var tempEmail = emailRegex.source;
var tempLink = linkRegex.source;

/* POST home page. */
router.post('/', authorizeUser('company'), function (req, res, next) {
    //TODO fikse at opslag kan redigeres. Vi tror det har noget med postcode at gøre

    //For at håndtere filupload og almindelige input data på tid skal man parse req igennem formidable.
    var formData = new formidable.IncomingForm();
    formData.parse(req, function (error, fields, files) {
        //laver et objekt med alle data
        var {
            id, title, post_type, email, contact, fk_education, country, post_start_date, post_end_date, post_text,
            city, postcode, company_link, post_document, dawa_json, dawa_uuid, expired, phone_number
        } = fields;

        var region = '';

        if (country == '1') {
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
            postcode = 0;
            dawa_json = '';
            dawa_uuid = '';
        }

        var indhold = {
            id, title, post_type, email, contact, fk_education, country, region, post_start_date, post_end_date,
            post_text, city, postcode, company_link, post_document, dawa_json, dawa_uuid, expired, phone_number
        };
        var inputError = false;



        //Test inputfelterne hvis javascript er deaktiveret af sikkerhedsmæssige årsager
        if (1 > title.length || title.length > 255) {
            console.log('Title length invalid');
            inputError = true;
        }

        if (post_type == 0) {
            console.log('Missing type');
            inputError = true;
        }

        if (email.length > 0) {
            if (email.length > 255) {
                console.log('Email too long');
                inputError = true;
            }
    
            if (!emailRegex.test(email)) {
                console.log('Invalid email');
                inputError = true;
            }
        }

        if (phone_number.length > 0) {
            if (phone_number.length > 255) {
                console.log('Phone number too long');
                inputError = true;
            }

            if (!numbersRegex.test(phone_number)) {
                console.log('Invalid phone number');
                inputError = true;
            }
        }

        if (1 > contact.length || contact.length > 255) {
            console.log('Contact length invalid');
            inputError = true;
        }

        if (post_start_date.length > 0) {
            let currDate = new Date();
            let inputDate = new Date(post_start_date);

            if (currDate > inputDate) {
                console.log('Past date');
                inputError = true;
            }
        } else {
            indhold.expired = false;
        }

        if (post_type == 1) {
            if (post_end_date.length > 0) {
                let currDate = new Date();
                let inputDate = new Date(post_end_date);

                if (currDate > inputDate) {
                    console.log('Past date');
                    inputError = true;
                }
            }
        } else {
            indhold.post_end_date = null;
        }
        
        if (post_text.length > 65536) {
            console.log('Plain text is to long');
            inputError = true;
        }

        if (company_link.length > 0) {
            if (!linkRegex.test(company_link)) {
                console.log("Link Invalid");
                inputError = true;
            }
        } else {
            indhold.company_link = null;
        }

        if (fk_education == 0) {
            console.log('Invalid choice');
            inputError = true;
        }

        function dbExe() {
            if (!inputError) {
                console.log(indhold);
                db.InternshipPost.update(indhold, {
                    where: {
                        id: id
                    },
                    /*dette skal være her for at felterne i databasen bliver opdateret returning: true,
                    plain: true*/
                });
                res.redirect('../internship_view/' + id)
            } else {
                console.log("update fail")
                res.redirect('../internship_view/' + id)
            }
        };

        /*fileUpload here*/
        var doc = files.post_document;

        //Stien til upload mappen skal være til stien i docker containeren.
        var publicUploadFolder = uploadFolder;

        //Generere unik data til filnavn med Date.now() og tilfældig tal.
        var datetime = Date.now();
        var randomNumber = Math.floor(Math.random() * (10 - 0 + 1) + 0);

        //Kombinere oprindelig filnavn med unik data for at lave unike filnavne.
        var newDocName = datetime + randomNumber + "_" + doc.name;

        function renameDoc(docName) {
            if (doc.size <= 10240000) {
                if (doc.type == "text/plain" || doc.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || doc.type == "application/pdf" || doc.type == "application/msword") {
                    if (docName != null) {
                        unlinkOldFiles(docName);
                    }
                    mv(doc.path, publicUploadFolder + newDocName, (errorRename) => {
                        if (errorRename) {
                            console.log("Unable to move file.");
                        } else {
                            indhold.post_document = newDocName;
                        }
                        dbExe()
                    });
                } else {
                    dbExe()
                }
            } else {
                console.log("invalid filesize");
                dbExe()
            }
        }

        //console.log(internshippost.findByPk)
        db.InternshipPost.findByPk(req.query.id, {
            attributes: ["post_document"]
        }).then(result => {
            //når vi kalder noget r, f.eks. rtitle eller remail er det for at refere til resultat så der principelt set kommer til at stå "result email"
            renameDoc(result["post_document"])
        }).catch();
    });
});


/* GET home page. */
router.get('/', authorizeUser('company'), function (req, res, next) {
    var generatedEducationOptions = "";
    db.Uddannelse.findAll({
        order: [
            ['name', 'ASC']
        ]
    }).then(result => {
        result.forEach(element => {
            generatedEducationOptions += "<option value='" + element.dataValues.id + "'>" + element.dataValues.name + "</option>";
        });
        db.InternshipPost.findByPk(req.query.id, {
            attributes: ["title", "post_type", "email", "contact", "fk_education", "country", "region", "post_start_date", "post_end_date", "post_text", "city", "postcode", "company_link", "post_document", "dawa_json", "dawa_uuid", "expired", "phone_number"]
        }).then(result => {
            var address = '';

            if (result['country'] == '1') {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var json = JSON.parse(this.responseText);
                        address = JSON.stringify(json[0])
                    }
                };
                xmlhttp.open("GET", "https://dawa.aws.dk/autocomplete?id=" + result['dawa_uuid'] + "&type=adresse", false);
                xmlhttp.setRequestHeader("Content-type", "application/json");
                xmlhttp.send();
            }

            //når vi kalder noget r, f.eks. rtitle eller remail er det for at refere til resultat så der principelt set kommer til at stå "result email"
            res.render('internship_post', {
                language: reqLang(req, res),
                title: 'Rediger opslag',
                rid: req.query.id,
                rtitle: result['title'],
                rposttype: result['post_type'],
                remail: result['email'],
                rphone: result['phone_number'],
                rcontact: result['contact'],
                reducation: result['fk_education'],
                rcountry: result['country'],
                rregion: result['region'],
                rpoststart /*start date*/: result['post_start_date'],
                rpostend: /*end date*/ result['post_end_date'],
                rtext /*post_text*/: result['post_text'],
                rcity: result['city'],
                rpostcode: result['postcode'],
                rhomepage: result['company_link'],
                rdoc: result["post_document"],
                raddress: address,

                linkRegex: tempLink, dateRegex: tempDate, emailRegex: tempEmail, expired: result['expired'],
                generatedEducationOptions: generatedEducationOptions,
                update: true
            });
        }).catch();
    }).catch();
});

router.get('/delete/:id', authorizeUser('company'), async function (req, res, next) {
    let internshipPost = await models.InternshipPost.findByPk(req.params.id);
    let company = await findUserByEmail(req.user);

    if (company.id === internshipPost.fk_company) {
        deleteInternshipPost(req.params.id)
        res.redirect('/');
    } else {
        res.status(403).render('error403', {layout: false});
    }

});

module.exports = router;
