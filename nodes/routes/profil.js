var express = require('express');
var router = express.Router();
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const models = require("../models");
const validation = require("../validation/input-validation");

router.get('/', function (req, res, next) {
    res.send("PROFIl: "+req.user);
});

router.get('/rediger', function (req, res, next) {
    let error = req.query.error;
    //todo if Student render student else virksomhed
    //todo: find bruger og indsæt dens data i render hbs.
    findUserByEmail(req.user).then((user)=>{
        if(user instanceof models.Student){
            res.send("not implemented yet mate");
        } else {
            res.render("rediger-virksomhedsprofil", {error: error, email: user.email, tlfnr: user.tlfnr, by: user.by, postnummer:user.postnr, cvr: user.cvrnr, firmanavn: user.navn, adresse: user.adresse, hjemmeside: user.hjemmeside, direktoer: user.direktoer, land: user.land});
        }
    })
});

router.post('/rediger-save', function (req, res, next) {
    console.log("her er post requesten");
    console.log(req.body);
    //validate
    // Indlæs variable fra viewet
    let tlfnr = req.body.telefonnummer;
    let by = req.body.by;
    let postnr = req.body.postnummer;
    let cvrnr = req.body.cvr;
    let firmanavn = req.body.navn;
    let adresse = req.body.adresse;
    let hjemmeside = req.body.hjemmeside;
    let direktoer = req.body.direktoer;
    let land = req.body.land;
    //todo logo
    let error = "?error=";
    if (!validation.validateCVR(cvrnr)){
        error += "invalidcvrerror";
        res.redirect('/profil/rediger' + error);
    }

    else if (!validation.validateCvrLength(cvrnr)){
        error += "cvrlengtherror";
        res.redirect('/profil/rediger' + error);
    }

    if (!validation.validatePhone(tlfnr)){
        error += "invalidphoneerror";
        res.redirect('/profil/rediger' + error);
    }

    if (!validation.validateCity(by)){
        error += "invalidbyerror";
        res.redirect('/profil/rediger' + error);
    }
});

module.exports = router;