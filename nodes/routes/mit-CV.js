var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('Mit-CV', {Profil: "Google Sørensen"} )
});

module.exports = router;

router.post('/submit', function(req, res, next) {
  let over = req.body.overskrift
  let studie = req.body.studieretning;
  let email = req.body.email;
  let telf = req.body.telefon;
  let hjem = req.body.hjemmeside;
  let om = req.body.om;
  let arbejdserfaring = req.body.arbejdserfaring;
  let udd = req.body.uddannelse;
  let hobby = req.body.hobby;

  var json = {
    over,
    studie,
    email,
    telf,
    hjem,
    om,
    arbejdserfaring,
    udd,
    hobby
  }
  res.send(JSON.stringify(json));
});