var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/Mit-CV', function(req, res, next) {
  res.render('Mit-CV', {Profil: "Google Sørensen"} )
});

module.exports = router;
