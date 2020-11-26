var express = require('express');
var router = express.Router();
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const models = require("../models");
const validation = require("../validation/input-validation");

router.get('/', function (req, res, next) {
    res.send("PROFIl: "+req.user);
});

router.get('/rediger', function (req, res, next) {
    let errors = req.query;
    console.log("ERRORS");
    console.log(errors);
    
    //todo if Student render student else virksomhed
    //todo: find bruger og indsæt dens data i render hbs.
    findUserByEmail(req.user).then((user)=>{
        if(user instanceof models.Student){
            res.send("not implemented yet mate");
        } else {
            //render with potential errors and information about the profile
            res.render("rediger-virksomhedsprofil", {EmailError: errors.EmailError, TlfnrError: errors.TlfnrError, ByError: errors.ByError, PostnrError: errors.PostnrError, CVRError: errors.CVRError, NavnError: errors.NavnError, AdresseError: errors.AdresseError, HjemmesideError: errors.HjemmesideError, DirektoerError: errors.DirektoerError, LandError: errors.LandError, LogoError: errors.LogoError, email: user.email, tlfnr: user.tlfnr, by: user.by, postnummer:user.postnr, cvr: user.cvrnr, firmanavn: user.navn, adresse: user.adresse, hjemmeside: user.hjemmeside, direktoer: user.direktoer, land: user.land});
        }
    });
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
    let errors = {
        EmailError: "",
        TlfnrError: "",
        ByError: "",
        PostnrError: "",
        CVRError: "",
        NavnError: "",
        AdresseError: "",
        HjemmesideError: "",
        DirektoerError: "",
        LandError: "",
        LogoError: "",
    }
    if (!validation.validateCVR(cvrnr)){
        errors.CVRError = "Ugyldigt CVR";
    }

    else if (!validation.validateCvrLength(cvrnr)){
        errors.CVRError = "Ugyldigt CVR længde";
    }

    if (!validation.validatePhone(tlfnr)){
        errors.TlfnrError = "Ugyldigt Telefonnummer";
    }

    if (!validation.validateCity(by)){
        errors.ByError = "Ugyldig By";
    }
    res.redirect('/profil/rediger?'+'EmailError='+errors.EmailError+'&TlfnrError='+errors.TlfnrError+'&ByError='+errors.ByError+'&PostnrError='+errors.PostnrError+'&CVRError='+errors.CVRError+'&NavnError='+errors.NavnError+'&AdresseError='+errors.AdresseError+'&HjemmesideError='+errors.HjemmesideError+'&DirektoerError='+errors.DirektoerError+'&LandError='+errors.LandError+'&LogoError='+errors.LogoError);
});

module.exports = router;