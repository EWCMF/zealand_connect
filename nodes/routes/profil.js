var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.send("PROFIl: "+req.user);
});

router.get('/rediger', function (req, res, next) {
    //todo: find bruger og insæt dens data i render hbs.
    res.render("rediger-virksomhedsprofil");
});

module.exports = router;