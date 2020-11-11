var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('Mit-CV', {
    Profil: "Hans Sørensen",
  })
});

router.get('/search', function (req, res, next) {
  let json = [{
      "overskrift": "hej med dig.",
      "underoverskrift": "ttt",
      "billede": "link her",
      "info": "blablablablablabla1"
    },
    {
      "overskrift": "hej med dig2.",
      "underoverskrift": "ttt2",
      "billede": "link her2",
      "info": "blablablablablabla1"
    }
  ]

  res.render('search_cv', {
    json: json
  });
});

module.exports = router;

router.post('/submit', function (req, res, next) {

  let overskrift = req.body.overskrift;
  let Uddannelse = req.body.uddannelse;
  let email = req.body.email;
  let sprog = req.body.sprog;
  let speciale = req.body.speciale;
  let telefon = req.body.telefon;
  let linkedIn = req.body.linkedIn;
  let om = req.body.om;
  let iT_Kompetencer = req.body.iT_Kompetencer;
  let UogFA = req.body.UogFA;
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
    Uddannelse,
    email,
    sprog,
    speciale,
    telefon,
    linkedIn,
    om,
    iT_Kompetencer,
    UogFA,
    erhvervserfaring,
    tidligere_uddannelse,
    hjemmeside,
    fritidsinteresser,
    offentlig
  }
  res.send(JSON.stringify(json));
  //seq.newCV("test", json);
});