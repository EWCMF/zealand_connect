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
  linkRegex
} = require("../constants/regex.js");
const db = require('../models');
const {
  REPL_MODE_SLOPPY
} = require('repl');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const models = require("../models");
var tempDate = dateRegex.source;
var tempEmail = emailRegex.source;
var tempLink = linkRegex.source;

/* POST home page. */
router.post('/', function (req, res, next) {
      //For at håndtere filupload og almindelige input data på tid skal man parse req igennem formidable.
      var formData = new formidable.IncomingForm();
      formData.parse(req, function (error, fields, files) {
        //laver et objekt med alle data
        var {
          title,
          email,
          contact,
          education,
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
          expired
        } = fields;

        var region = '';

        if (country == '1') {
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
          postcode = 0;
          dawa_json = '';
          dawa_uuid = '';
        }

        var indhold = {
          title,
          email,
          contact,
          education,
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
          expired
        };

        var inputError = false;

        //Test inputfelterne hvis javascript er deaktiveret af sikkerhedsmæssige årsager
        if (1 > title.length || title.length > 255) {
          console.log('Title lenght invalid');
          inputError = true;
        }
        if (email.length > 255) {
          console.log('Email to long');
          inputError = true;
        }
        if (!emailRegex.test(email)) {
          console.log('Invalid email');
          inputError = true;
        }
        if (1 > contact.length || contact.length > 255) {
          console.log('Contact length invalid');
          inputError = true;
        }
        if (!dateRegex.test(post_start_date)) {
          console.log('Invalid date');
          inputError = true;
        }
        if (!dateRegex.test(post_end_date)) {
          console.log('Invalid date');
          inputError = true;
        }
        if (post_text.length > 65536) {
          console.log('Plain text is to long');
          inputError = true;
        }
        if (!linkRegex.test(company_link)) {
          console.log("Link Invalid");
          inputError = true;
        }
        if (education == 0) {
          console.log('Invalid choice');
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
            res.redirect('../internship_view/' + post.id)
          }
        }

        if (files.post_document.size === 0) {
          console.log(JSON.stringify(indhold))
          // TODO: valider adresse-felt
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

/* GET home page. */
router.get('/', function (req, res, next) { 

      var generatedEducationOptions = '';

      db.Uddannelser.findAll({
        order: [
          ['name', 'ASC']
        ]
      }).then(result => {
        result.forEach(element => {
          generatedEducationOptions += "<option value='" + element.dataValues.id + "'>" + element.dataValues.name + "</option>";
        });
        res.render('internship_post', {
          title: 'Opret opslag',
          linkRegex: tempLink,
          dateRegex: tempDate,
          emailRegex: tempEmail,
          generatedEducationOptions: generatedEducationOptions
        });
      }).catch();
});

module.exports = router;