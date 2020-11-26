const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const e = require('express');
var express = require('express');
var router = express.Router();
const db = require('../models');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;

router.get('/', function (req, res, next) {
  if (req.user == null) {
    res.send('Du har ikke adgang til denne resurse.');
  }

  findUserByEmail(req.user).then((user) => {

    if (user.cv == null) {
      res.render('mit-cv', {
        Profil: user.fornavn + " " + user.efternavn
      })
    }

    db.CV.findOne({
      raw: true,
      nest: true,
      where: {
        id: parseInt(user.cv.id)
      },
      include: {
        model: db.Student,
        as: 'student'
      }
    }).then((cv) => {
      console.log(cv);

      if (cv.hjemmeside.includes("://")) {
        console.log(cv.hjemmeside.indexOf("://") + 3)
        cv.hjemmeside = cv.hjemmeside.substring(cv.hjemmeside.indexOf("://") + 3);
        //console.log(cv.linkedIn);
      }

      if (cv.linkedIn.includes("://")) {
        console.log(cv.linkedIn.indexOf("://") + 3)
        cv.linkedIn = cv.linkedIn.substring(cv.linkedIn.indexOf("://") + 3);
        //console.log(cv.linkedIn);
      }

      if (cv.yt_link.includes("://")) {
        console.log(cv.yt_link.indexOf("://") + 3)
        cv.yt_link = cv.yt_link.substring(cv.yt_link.indexOf("://") + 3);
        //console.log(cv.linkedIn);
      }

      res.render('cv', {
        json: cv
      });

    });
  });
});

router.post('/submit', async function (req, res, next) {

  if (req.user == null) {
    res.send('Du har ikke adgang til denne resurse.');
  }

  var student = await findUserByEmail(req.user)

  let overskrift = req.body.overskrift;
  let uddannelse = req.body.uddannelse;
  let email = req.body.email;
  let sprog = req.body.sprog;
  let speciale = req.body.speciale;
  let telefon = req.body.telefon;
  let linkedIn = req.body.linkedIn;
  let yt_link = req.body.youtube_link;
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


  var gyldig;
  var besked;
  if (overskrift == '' || uddannelse == '' 
  || email == '' || sprog == '' || telefon 
  || it_kompetencer == '' || tidligere_uddannelse == '') {
    gyldig = false;
    besked = "CV'et er gemt men er utilgængeligt for andre indtil alle nødvendige felter er udfyldte."
  } else {
    gyldig = true;
    besked = "CV'et er gemt."
  }

  var student_id = student.id

  var json = {
    overskrift,
    uddannelse,
    email,
    sprog,
    speciale,
    telefon,
    linkedIn,
    yt_link,
    om_mig,
    it_kompetencer,
    udenlandsophold_og_frivilligt_arbejde,
    erhvervserfaring,
    tidligere_uddannelse,
    hjemmeside,
    fritidsinteresser,
    offentlig,
    gyldig,
    student_id
  }
  
  const [cv, created] = await db.CV.findOrCreate({
    where: {
      student_id: student.id
    },
    defaults: json
  });

  if (!created) {
    await db.CV.update(json, {
      where: {
        id: cv.id
      }
    })

    besked = 'Ændringer er gemt.'
  }

  JSON.stringify(cv);
  res.send(cv);
});

router.get('/delete', function (req, res, next) {
  if (req.query.id == null) {
    res.send("Use id");
  } else {
    db.CV.destroy({
      where: {
        id: req.query.id
      }
    });
    res.send("Entry deleted");
  }
});

module.exports = router;