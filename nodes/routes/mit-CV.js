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
  let studieretning = req.body.studieretning;
  let email = req.body.email;
  let telefon = req.body.telefon;
  let hjemmeside = req.body.hjemmeside;
  let om = req.body.om;
  let arbejdserfaring = req.body.arbejdserfaring;
  let uddannelse = req.body.uddannelse;
  let hobby = req.body.hobby;
  let offentligCheckbox = req.body.offentligCheckBox;

  var offentlig;
  if (offentligCheckbox == "on") {
    offentlig = true;
  } else {
    offentlig = false;
  }

  var json = {
    overskrift,
    studieretning,
    email,
    telefon,
    hjemmeside,
    om,
    arbejdserfaring,
    uddannelse,
    hobby,
    offentlig
  }

  res.send("Data er gemt (temp)");
  seq.newCV("test", json);
});