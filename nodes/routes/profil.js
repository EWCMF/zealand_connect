var express = require('express');
var router = express.Router();
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const models = require("../models");

router.get('/', function (req, res, next) {
    res.send("PROFIl: "+req.user);
});

router.get('/rediger', function (req, res, next) {
    //todo if Student render student else virksomhed
    //todo: find bruger og indsæt dens data i render hbs.
    findUserByEmail(req.user).then((user)=>{
        if(user instanceof models.Student){
            res.send("not implemented yet mate");
        } else {
            res.render("rediger-virksomhedsprofil", {email: user.email, tlfnr: user.tlfnr, by: user.by, postnummer:user.postnr, cvr: user.cvrnr, firmanavn: user.navn, adresse: user.adresse, hjemmeside: user.hjemmeside, direktoer: user.direktoer, land: user.land});
        }
    })
});

module.exports = router;