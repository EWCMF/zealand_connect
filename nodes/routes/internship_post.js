var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;//Skal bruges til kalder API'er.
var sortJsonArray = require('sort-json-array');//Brugt til at få byer i alfabetisk orden.
var formidable = require("formidable");//Skal bruges når man håndtere filupload og alm. input i samme POST.
var fs = require("fs");//Bruges til grundlæggen file hændtering.
var mv = require('mv');//Skal bruges for kunne gemme uploads uden for container.
const db = require('../models');
const internshippost = require('../models/internshippost');

/* POST home page. */
router.post('/', function (req, res){
  //For at håndtere filupload og almindelige input data på tid skal man parse req igennem formidable.
  var formData = new formidable.IncomingForm();
  formData.parse(req, function(error, fields, files){
    //laver et objekt med alle data
    const { title, email, contact, education, country, region, post_start_date, post_end_date, post_text, city, postcode, cvr_number, company_link, company_logo, post_document} = fields;
    var indhold = { title, email, contact, education, country, region, post_start_date, post_end_date, post_text, city, postcode, cvr_number, company_link, company_logo, post_document};
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
    var dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    var cvrReg = /^[0-9]{8}$/
    var linkReg = /^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+).[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$/
    var validPicRegex =/\.(jpg|jpeg|png|bmp|svg)$/
    var vaildFileRegex = /\.(pdf|docx|doc|txt)$/
    var inputError = false;

    var cityArray=[];

    //Test inputfelterne hvis javascript er deaktiveret af sikkerhedsmæssige årsager
    if (1 > title.length || title.length > 255) {console.log('Title lenght invalid'); inputError = true;}
    if (email.length > 255) {console.log('Email to long'); inputError = true;}
    if (!emailRegex.test(email)) {console.log('Invalid email'); inputError = true;}
    if (1 > contact.length || contact.length > 255) {console.log('Contact length invalid'); inputError = true;}
    if (!dateReg.test(post_start_date)) {console.log('Invalid date'); inputError = true;}
    if (!dateReg.test(post_end_date)) {console.log('Invalid date'); inputError = true;}
    if (post_text.length > 65536) {console.log('Plain text is to long'); inputError = true;}
    if (!cvrReg.test(cvr_number)) {console.log("CVR number invalid"); inputError = true;}
    if (!linkReg.test(company_link)) {console.log("Link Invalid"); inputError = true;}
    if (education == 0) {console.log('Invalid choice'); inputError = true;}

    //Database kode må først køre efter flyttelses og omdøb af uploadet filer er fuldført.
    function dbExe(){
      if (!inputError) {
        db.InternshipPost.create(indhold).then((internshippost) => res.send(internshippost)).catch((error) => {
        console.log(error);
         return res.status(400).send(error);
      });}
      res.render('internship_post', {title: 'Express'});
    }

    //Generere og validere om byen angivet i frontend er korrekt.
    function generateAndValidateCityArray(){
      if(country==1){
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
          if (this.readyState == 4 && this.status == 200){
            var myObj = JSON.parse(this.responseText);
            myObj = sortJsonArray(myObj, 'primærtnavn', 'asc')
            myObj.forEach(element => {
              cityArray.push(element.primærtnavn);
            });

            isCityValid=false;

            for(var i=0;i<cityArray.length;i++){
              if(cityArray[i]===city){
                isCityValid=true;
                console.log('Valid city found');
              }
            }

            if(!isCityValid){
              inputError=true;
              console.log('City was invalid');
            }
            dbExe();
          }
        };
        xmlhttp.open("GET", "https://dawa.aws.dk/steder?hovedtype=Bebyggelse&undertype=by", true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send();
      }else{
        dbExe();
      }
    }

    if(!files){
      generateAndValidateCityArray();
    }else{
      /*fileUpload here*/
      var doc=files.post_document;
      var logo=files.company_logo;

      //Stien til upload mappen skal være til stien i docker containeren.
      var publicUploadFolder="/usr/src/app/public/uploads/";

      //Generere unik data til filnavn med Date.now() og tilfældig tal.
      var datetime = Date.now();

      var randomNumber=Math.floor(Math.random() * (10 - 0 + 1) + 0);

      //Kombinere oprindelig filnavn med unik data for at lave unike filnavne.
      var newDocName=datetime+randomNumber+"_"+doc.name;
      var newLogoName=datetime+randomNumber+"_"+logo.name;

      //Når filer bliver uploaded bliver de lagt i en midlertigt mappe med tilfældignavn.
      //Nedenstående flytter og omdøber filer på sammetid
      if(doc.type== "text/plain" || doc.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || doc.type == "application/pdf" || doc.type == "application/msword"){
        mv(doc.path,publicUploadFolder+newDocName,(errorRename)=>{
          console.log(doc.path);
          if(errorRename){
            console.log("Unable to move file.");
            console.log(errorRename);
          }else{
            console.log(doc.type)
            indhold.post_document=newDocName;
          }
          reNameLogo();
        });
      } else {
        reNameLogo();
      }

      function reNameLogo(){
        if (logo.type == "image/jpeg" || logo.type == "image/png" || logo.type == "image/svg+xml" || logo.type == "image/bmp" ){
          mv(logo.path,publicUploadFolder+newLogoName,(errorRename)=>{
            console.log(logo.path);
            if(errorRename){
              console.log("Unable to move file.");
              console.log(errorRename);
            }else{
                indhold.company_logo=newLogoName;
            }
            generateAndValidateCityArray();
          });
        } else {
          generateAndValidateCityArray();
        }
      }
    }
    /*formData.onPart = function(part){
      if(!part.filename && part.filename.match(vaildFileRegex)) {
        this.handlePart(part);
      }
      else {
        console.log(part.filename + 'is not allowed')
      }
    }*/
  })

});

/* GET home page. */
router.get('/', function (req, res, next) {
  var generatedCityOptions = "";
  var generatedPostCodeOptions = "";
  function generateCityOptions() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        myObj = sortJsonArray(myObj, 'primærtnavn', 'asc')
        myObj.forEach(element => {
          generatedCityOptions += "<option value='"+element.primærtnavn+"'>"+element.primærtnavn+"</option>"
        });
        res.render('internship_post', { title: 'Express', generatedCityOptions: generatedCityOptions, generatedPostCodeOptions: generatedPostCodeOptions });
      }
    };
    xmlhttp.open("GET", "https://dawa.aws.dk/steder?hovedtype=Bebyggelse&undertype=by", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send();
  }

  function generatePostCodeOptions() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        myObj.forEach(element => {
          generatedPostCodeOptions += "<option value='"+element.nr+"'>"+element.nr+"</option>"
        });
        generateCityOptions();
      }
    };
    xmlhttp.open("GET", "https://dawa.aws.dk/postnumre", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send();
  }

  generatePostCodeOptions();
});

module.exports = router;
