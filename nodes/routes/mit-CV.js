const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const e = require('express');
var express = require('express');
var router = express.Router();
const db = require('../models');

router.get('/', function (req, res, next) {
  res.render('Mit-CV', {
    Profil: "Hans Sørensen",
  })
});

router.get('/Create_pdf', function (req, res, next) {
  // https://pdfkit.org/docs/guide.pdf
  // http://pdfkit.org/
var pdf = require('pdfkit');
var fs = require('fs');

var myDoc = new pdf;

myDoc.pipe(fs.createWriteStream('PDF/Test.pdf'));

myDoc.font('Times-Roman')
        .fontSize(48)
        .text('Jeg tror det virker nu',100,100);
myDoc.end().next(
  () => {
    res.setHeader('content-type', 'application/pdf');
    res.download('PDF/Test2.pdf', 'pdf.pdf');
  }
);
});

router.get('/Download_pdf', function (req, res, next) {
    
});

router.post('/submit', function (req, res, next) {

  let overskrift = req.body.overskrift;
  let uddannelse = req.body.uddannelse;
  let email = req.body.email;
  let sprog = req.body.sprog;
  let speciale = req.body.speciale;
  let telefon = req.body.telefon;
  let linkedIn = req.body.linkedIn;
  let om_mig = req.body.om;
  let it_kompetencer = req.body.iT_Kompetencer;
  let udenlandsophold_og_frivilligt_arbejde = req.body.UogFA;
  let erhvervserfaring = req.body.erhvervserfaring;
  let tidligere_uddannelse = req.body.tidligere_uddannelse;
  let hjemmeside = req.body.hjemmeside;
  let fritidsinteresser = req.body.fritidsinteresser;
  let offentligCheckbox = req.body.offentligCheckBox;

  var offentlig;
  if (offentligCheckbox == "on") {
    offentlig = true;
  } else {
    offentlig = false;
  }

  var json = {
    overskrift,
    uddannelse,
    email,
    sprog,
    speciale,
    telefon,
    linkedIn,
    om_mig,
    it_kompetencer,
    udenlandsophold_og_frivilligt_arbejde,
    erhvervserfaring,
    tidligere_uddannelse,
    hjemmeside,
    fritidsinteresser,
    offentlig
  }
  res.send(JSON.stringify(json));
  db.CV.create(json).then((cv) => {
    console.log(cv);
  }).catch((error) => {
    console.log(error)
  });
});

router.get('/delete', function (req, res, next) {
  if (req.query.id == null) {
    res.send("Use id");
  } else {
    db.CV.destroy({
      where:{
        id:req.query.id
      }
    });
    res.send("Entry deleted");
  }
});

module.exports = router;