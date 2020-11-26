var express = require('express');
var router = express.Router();
var models = require('../models');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;

router.get('/', function (req, res, next) {
    findUserByEmail(req.user).then((user) => {
        if (user instanceof models.Virksomhed) {
            //TODO: Her skal der være virksomhedsprofil
            res.send("HER SKAL DER VÆRE VIRKSOMHEDSPROFIL");
        } else if (user instanceof models.Student) {
            res.render("studentprofil");
        }
    }); 
});

router.get('/rediger', function (req, res, next) {
    res.render("rediger-virksomhedsprofil");
    //todo: find bruger og insæt dens data i render hbs.
});

module.exports = router;