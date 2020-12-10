var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; //Skal bruges til kalder API'er.
var sortJsonArray = require('sort-json-array'); //Brugt til at få byer i alfabetisk orden.
var formidable = require("formidable"); //Skal bruges når man håndtere filupload og alm. input i samme POST.
var fs = require("fs");//Bruges til grundlæggen file hændtering.
var mv = require('mv');//Skal bruges for kunne gemme uploads uden for container.
const { emailRegex, dateRegex, cvrRegex, linkRegex } = require("../constants/regex.js");
const db = require('../models');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const models = require("../models");

var tempDate = dateRegex.source
var tempCVR = cvrRegex.source
var tempEmail = emailRegex.source
var tempLink = linkRegex.source

/* POST home page. */
router.post('/', function (req, res, next) {
  if (req.user !=null) {
    var user = findUserByEmail(req.user);
    if(user instanceof models.Virksomhed){
      //For at håndtere filupload og almindelige input data på tid skal man parse req igennem formidable.
  var formData = new formidable.IncomingForm();
  formData.parse(req, function (error, fields, files) {
    //laver et objekt med alle data
    var { id, title, email, contact, education, country, post_start_date, post_end_date, post_text,
      city, postcode, cvr_number, company_link, company_logo, post_document, dawa_json, dawa_uuid, expired } = fields;

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
      id, title, email, contact, education, country, region, post_start_date, post_end_date,
      post_text, city, postcode, cvr_number, company_link, company_logo, post_document, dawa_json, dawa_uuid, expired
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
    if (!cvrRegex.test(cvr_number)) {
      console.log("CVR number invalid");
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

    /*
    async function dbExe() {
      if (!inputError) {
          const post = await db.InternshipPost.create(indhold).catch((error) => {
            console.log(error);
            return res.status(400).send(error);
          });
          res.redirect('../internship_view/'+post.id)

      }
    }
    */
    function dbExe() {
      if (!inputError) {
        console.log(indhold);
        db.InternshipPost.update(indhold, {
          where: {
            id: id
          },
          /*dette skal være her for at felterne i databasen bliver opdateret*/ returning: true,
          plain: true
        });
        res.redirect('../internship_view/' + id)
      } else {
        console.log("update fail")
        res.redirect('../internship_view/' + id)
      }
    };

    /*fileUpload here*/
    var doc = files.post_document;
    var logo = files.company_logo;

    //Stien til upload mappen skal være til stien i docker containeren.
    var publicUploadFolder = "/usr/src/app/public/uploads/";

    //Generere unik data til filnavn med Date.now() og tilfældig tal.
    var datetime = Date.now();
    var randomNumber = Math.floor(Math.random() * (10 - 0 + 1) + 0);

    //Kombinere oprindelig filnavn med unik data for at lave unike filnavne.
    var newDocName = datetime + randomNumber + "_" + doc.name;
    var newLogoName = datetime + randomNumber + "_" + logo.name;

    function renameDoc(docName, logoName) {
      if (doc.size <= 10240000) {
        if (doc.type == "text/plain" || doc.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || doc.type == "application/pdf" || doc.type == "application/msword") {
          unlinkOldFiles(docName)
          mv(doc.path, publicUploadFolder + newDocName, (errorRename) => {
            if (errorRename) {
              console.log("Unable to move file.");
            } else {
              indhold.post_document = newDocName;
            }
            reNameLogo(logoName);
          });
        } else {
          reNameLogo(logoName);
        }
      } else {
        console.log("invalid filesize");
        reNameLogo();
      }
    }

    function reNameLogo(logoName) {
      if (logo.size <= 10240000) {
        if (logo.type == "image/jpeg" || logo.type == "image/png" || logo.type == "image/svg+xml" || logo.type == "image/bmp") {
          unlinkOldFiles(logoName)
          mv(logo.path, publicUploadFolder + newLogoName, (errorRename) => {
            if (errorRename) {
              console.log("Unable to move file.");
            } else {
              indhold.company_logo = newLogoName;
            }
            dbExe();
          });
        } else {
          dbExe();
        }
      } else {
        console.log("invalid filesize");
        dbExe();
      }
    }
    //console.log(internshippost.findByPk)
    db.InternshipPost.findByPk(req.query.id, {
      attributes: ["company_logo", "post_document"]
    }).then(result => {
      //når vi kalder noget r, f.eks. rtitle eller remail er det for at refere til resultat så der principelt set kommer til at stå "result email"
      renameDoc(result["post_document"], result["company_logo"])
    }).catch();
  });
    }
    else {
      res.status(403);
      res.send({
        errorCode: "403 - forbidden"
      });
    }
  }
  else {
    res.status(403);
    res.send({
      errorCode: "403 - forbidden"
    });
  }
});


/* GET home page. */
router.get('/', function (req, res, next) {
  var generatedEducationOptions = "";

  db.Uddannelser.findAll({
    order: [
      ['name', 'ASC']
    ]
  }).then(result => {
    result.forEach(element => {
      generatedEducationOptions += "<option value='" + element.dataValues.id + "'>" + element.dataValues.name + "</option>";
    });
    db.InternshipPost.findByPk(req.query.id, {
      attributes: ["title", "email", "contact", "education", "country", "region", "post_start_date", "post_end_date", "post_text", "city", "postcode", "cvr_number", "company_link", "company_logo", "post_document", "dawa_json", "dawa_uuid", "expired"]
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
      res.render('internship_update', {
        title: 'Express',
        rid: req.query.id,
        rtitle: result['title'],
        remail: result['email'],
        rcontact: result['contact'],
        reducation: result['education'],
        rcountry: result['country'],
        rregion: result['region'],
        rpoststart /*start date*/: result['post_start_date'],
        rpostend: /*end date*/ result['post_end_date'],
        rtext /*post_text*/: result['post_text'],
        rcity: result['city'],
        rpostcode: result['postcode'],
        rcvr: result['cvr_number'],
        rcompany: result['company_link'],
        rlogo: result["company_logo"],
        rdoc: result["post_document"],
        raddress: address,

        linkRegex: tempLink, dateRegex: tempDate, emailRegex: tempEmail, cvrRegex: tempCVR, expired: result['expired'],
        generatedEducationOptions: generatedEducationOptions
      });
    }).catch();
  }).catch();
});

router.get('/delete', function (req, res, next) {
  db.InternshipPost.findByPk(req.query.id, {
    attributes: ["company_logo", "post_document"]
  }).then(result => {
    //når vi kalder noget r, f.eks. rtitle eller remail er det for at refere til resultat så der principelt set kommer til at stå "result email"
    unlinkOldFiles(result["post_document"])
    unlinkOldFiles(result["company_logo"])
    deleteFromDb()
  }).catch();
  function deleteFromDb() {
    db.InternshipPost.destroy({
      where: {
        id: req.query.id
      }
    })
    res.render('internship_update', {
      title: 'Express'
    });
  }
});

function unlinkOldFiles(filename) {
  fs.unlink("/usr/src/app/public/uploads/" + filename, (err) => {
    if (err) throw err
    console.log(filename + " was deleted")
  });
}


module.exports = router;
