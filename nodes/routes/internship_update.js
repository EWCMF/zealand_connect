var express = require('express');
var router = express.Router();
const db = require('../models');
const internshippost = require('../models/internshippost');

/* POST home page. */
router.post('/', function (req, res, next) {
  //laver et objekt med alle data
  const { id, title, email, contact, education, country, region, post_start_date, post_end_date, post_text } = req.body;
  var indhold = {id, title, email, contact, education, country, region, post_start_date, post_end_date, post_text };
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
  var dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
  var inputError = false;

  console.log(req.body);


  //Test inputfelterne
  if (1 > title.length || title.length > 255) { console.log('Title lenght invalid'); inputError = true; }
  if (email.length > 255) { console.log('Email to long'); inputError = true; }
  if (!emailRegex.test(email)) { console.log('Invalid email'); inputError = true; }
  if (1 > contact.length || contact.length > 255) { console.log('Contact length invalid'); inputError = true; }
  if (!dateReg.test(post_start_date)) { console.log('Invalid date'); inputError = true; }
  if (!dateReg.test(post_end_date)) { console.log('Invalid date'); inputError = true; }
  if (post_text.length > 65536) { console.log('Plain text is to long'); inputError = true; }

  //logger resultatet af testene
  console.log(emailRegex.test(email))
  console.log(dateReg.test(post_start_date))
  console.log(dateReg.test(post_end_date))
  
  db.InternshipPost.update(indhold, {where:{
    id: id
  }, /*dette skal være her for at felterne i databasen bliver opdateret*/returning: true, plain: true });
  res.render('internship_update', { title: 'Express' });
  
 
});

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.query.id)
  //console.log(internshippost.findByPk)
  db.InternshipPost.findByPk(req.query.id, {attributes:["title","email","contact","education","country","region","post_start_date","post_end_date","post_text"]}).then(result => {
    //når vi kalder noget r, f.eks. rtitle eller remail er det for at refere til resultat så der principelt set kommer til at stå "result email"
    res.render('internship_update', { title: 'Express',rid: req.query.id, rtitle: result['title'], remail: result['email'], rcontact: result['contact'], reducation: result['education'], rcountry: result['country'], rregion: result['region'], rpoststart/*start date*/: result['post_start_date'], rpostend:/*end date*/ result['post_end_date'], rtext/*post_text*/:result['post_text'] });
  }).catch()
  //findOne({where:{id: req.query.id}})
});

router.get('/delete', function (req, res, next) {
  res.render('internship_update', { title: 'Express' });
});

module.exports = router;
