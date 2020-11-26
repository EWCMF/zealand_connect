var express = require('express');
var router = express.Router();
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const editVirksomhed = require('../persistence/usermapping').editVirksomhed;
const models = require("../models");
const validation = require("../validation/input-validation");
var { reqLang } = require('../public/javascript/request');

router.get('/', function (req, res, next) {
    findUserByEmail(req.user).then((user) => {
        if (user instanceof models.Virksomhed) {
            //TODO: Her skal der være virksomhedsprofil
            res.render('visprofil', {language: reqLang(req,res)})
        } else if (user instanceof models.Student) {
            res.render("studentprofil");
        }
    }); 
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
            res.render("rediger-virksomhedsprofil", {succesBesked: req.query.succesBesked, fejlBesked: req.query.fejlBesked, EmailError: errors.EmailError, TlfnrError: errors.TlfnrError, ByError: errors.ByError, PostnrError: errors.PostnrError, CVRError: errors.CVRError, NavnError: errors.NavnError, AdresseError: errors.AdresseError, HjemmesideError: errors.HjemmesideError, DirektoerError: errors.DirektoerError, LandError: errors.LandError, LogoError: errors.LogoError, email: user.email, tlfnr: user.tlfnr, by: user.by, postnummer:user.postnr, cvr: user.cvrnr, firmanavn: user.navn, adresse: user.adresse, hjemmeside: user.hjemmeside, direktoer: user.direktoer, land: user.land});
        }
    });
});

router.post('/rediger-save', function (req, res, next) {
    console.log("her er post requesten");
    console.log(req.body);
    //validate
    // Indlæs variable fra viewet
    let email = req.body.virksomhedEmail;
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
    //update the database if no erros present
    let atLeastOneErrorIsPresent = false;
    for (let value of Object.values(errors)) {
        console.log("error:");
        console.log(value);
        if(value!=''){
            //an error was here!
            atLeastOneErrorIsPresent=true;
            break;
        }
    }
    let succesBesked = '';
    let fejlBesked = '';
    if(!atLeastOneErrorIsPresent){
        editVirksomhed(email, cvrnr, firmanavn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by);
        succesBesked = 'Succesfuldt opdateret brugeren';
    } else {
        fejlBesked = 'Fejl ved opdatering af brugeren';
    }
    res.redirect('/profil/rediger?succesBesked='+succesBesked+'&fejlBesked='+fejlBesked+'&EmailError='+errors.EmailError+'&TlfnrError='+errors.TlfnrError+'&ByError='+errors.ByError+'&PostnrError='+errors.PostnrError+'&CVRError='+errors.CVRError+'&NavnError='+errors.NavnError+'&AdresseError='+errors.AdresseError+'&HjemmesideError='+errors.HjemmesideError+'&DirektoerError='+errors.DirektoerError+'&LandError='+errors.LandError+'&LogoError='+errors.LogoError);
});



router.get('/getUser',function(req, res, next) {
    findUserByEmail(req.user).then((user)=>{
        res.send(user);
    })
});

module.exports = router;