var express = require('express');
var router = express.Router();
var seq = require('../persistence/sequelize-tidlig');

router.get('/', function (req, res, next) {
  seq.hentCV(1).then((json) => {
    // console.log(json);
    res.render('Mit-CV', {
      Profil: "Hans Sørensen",
      Overskrift: json.overskrift,
      Studieretning: json.studieretning,
      Email: json.email,
      Telefon: json.telefon,
      Hjemmeside: json.hjemmeside,
      Om: json.om,
      Arbejdserfaring: json.arbejdserfaring,
      Uddannelse: json.uddannelse,
      Hobby: json.hobby,
      Offentlig: json.offentlig,
    })
  }, () => {
    res.render('Mit-CV', {
      Profil: "Hans Sørensen",
      Offentlig: false,
    })
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