var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//const fileUpload = require('express-fileupload');
const db = require('../models');
const internshippost = require('../models/internshippost');

/* POST home page. */
router.post('/', function (req, res, next) {
  //laver et objekt med alle data
  const { title, email, contact, education, country, region, post_start_date, post_end_date, post_text, city_text, cvr_number, company_link, company_logo, post_document} = req.body;
  var indhold = { title, email, contact, education, country, region, post_start_date, post_end_date, post_text, city_text, cvr_number, company_link, company_logo, post_document};
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
  var dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
  var inputError = false;
  var cvrReg = /^[0-9]{8}$/
  var linkReg = "/^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+).[a-z]{2,5}(:[0-9]{1,5})?(/.)?$/"

  //Test inputfelterne
  if (1 > title.length || title.length > 255) {console.log('Title lenght invalid'); inputError = true;}
  if (email.length > 255) {console.log('Email to long'); inputError = true;}
  if (!emailRegex.test(email)) {console.log('Invalid email'); inputError = true;}
  if (1 > contact.length || contact.length > 255) {console.log('Contact length invalid'); inputError = true;}
  if (!dateReg.test(post_start_date)) {console.log('Invalid date'); inputError = true;}
  if (!dateReg.test(post_end_date)) {console.log('Invalid date'); inputError = true;}
  if (post_text.length > 65536) {console.log('Plain text is to long'); inputError = true;}
  if (!cvrReg.test(cvr_number)) {console.log("CVR number invalid"); inputError = true;}
  if (!linkReg.test(company_link)) {console.log("Link Invalid"); inputError  = true;}

  //logger resultatet af testene
  console.log(emailRegex.test(email))
  console.log(dateReg.test(post_start_date))
  console.log(dateReg.test(post_end_date))
  console.log(cvrReg.test(cvr_number))
  console.log(linkReg.test(company_link))
  

  if(!req.files){
  }else{
    /*fileUpload here*/
    var doc=req.files.post_document;
    var logo=req.files.company_logo;
    doc.mv('../public/uploads/'+doc.name);
    logo.mv('../public/uploads/'+logo.name);
  }

  if (!inputError) {
    db.InternshipPost.create(indhold).then((internshippost) => res.send(internshippost)).catch((error) => {
    console.log(error);
     return res.status(400).send(error);
  });}
  res.render('internship_post', { title: 'Express' });

});


/* GET home page. */
router.get('/', function (req, res, next) {
  var generatedCityOptions = "";
  function generateCityOptions() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200  ) {
        var myObj = JSON.parse(this.responseText);
        
        myObj.forEach(element => {
          generatedCityOptions += "<option value='"+element.primærtnavn+"'>"+element.primærtnavn+"</option>"
        });
        res.render('internship_post', { title: 'Express', generatedCityOptions: generatedCityOptions });
      }
    };
    xmlhttp.open("GET", "https://dawa.aws.dk/steder?hovedtype=Bebyggelse&undertype=by", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send();
  }
  generateCityOptions();
  
});


module.exports = router;
// https://dawa.aws.dk/steder?hovedtype=Bebyggelse&undertype=by
