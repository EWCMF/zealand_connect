var express = require('express');
var router = express.Router();
const db = require('../models');
const internshippost = require('../models/internshippost');

/* POST home page. */
router.post('/', function (req, res, next) {
  //laver et objekt med alle data
  const { title, email, contact, education, country, region, applicationDeadline, internshipEmploymentDate, plainText } = req.body;
  var indhold = { title, email, contact, education, country, region, applicationDeadline, internshipEmploymentDate, plainText };
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
  var dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
  var inputError = false;

  console.log(req.body);


  //Test inputfelterne 
  if (1 > title.length || title.length > 255) { console.log('Title lenght invalid'); inputError = true; }
  if (email.length > 255) { console.log('Email to long'); inputError = true; }
  if (!emailRegex.test(email)) { console.log('Invalid email'); inputError = true; }
  if (1 > contact.length || contact.length > 255) { console.log('Contact length invalid'); inputError = true; }
  if (!dateReg.test(applicationDeadline)) { console.log('Invalid date'); inputError = true; }
  if (!dateReg.test(internshipEmploymentDate)) { console.log('Invalid date'); inputError = true; }
  if (plainText.length > 65536) { console.log('Plain text is to long'); inputError = true; }

  //logger resultatet af testene
  console.log(emailRegex.test(email))
  console.log(dateReg.test(applicationDeadline))
  console.log(dateReg.test(internshipEmploymentDate))

  db.InternshipPost.create(indhold).then((internshippost) => res.send(internshippost)).catch((error) => {
    console.log(error);
    return res.status(400).send(error);
  });
  res.render('internship_post', { title: 'Express' });

});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('internship_post', { title: 'Express' });
});

module.exports = router;