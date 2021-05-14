const express = require('express');
const router = express.Router();
const db = require('../models');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const deleteCV = require('../persistence/cv-mapping').deleteCV;
const { reqLang } = require('../public/javascript/request');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;
const { emailRegex, phoneRegex, linkRegex, postcodeRegex } = require('../constants/regex');
const fetch = require('node-fetch');

router.get('/', authorizeUser('professor'), async function (req, res, next) {
    var professor = res.locals.user;

    if (professor.cv == null) {
        return res.render('professor-cv', {
            language: reqLang(req, res),
            profil: professor.fornavn + " " + professor.efternavn,
            email: professor.email,
        })
    }

    db.ProfessorCV.findOne({
        raw: true,
        nest: true,
        where: {
            id: parseInt(professor.cv.id)
        },
        include: [{
            model: db.Professor,
            as: 'professor'
        }]
    }).then((cv) => {

        res.redirect('/search-professor-cv/' + cv.id);

    });
});

router.post('/submit', authorizeUser('professor'), async function (req, res, next) {
    let professor = res.locals.user;

    let overskrift = req.body.overskrift;
    let email = req.body.email;
    let sprog = req.body.sprog;
    let telefon = req.body.telefon;
    let linkedIn = req.body.linkedIn;
    let arbejdssted = req.body.arbejdssted;
    let stilling = req.body.stilling;
    let uddannelse = req.body.uddannelse;
    let teaches = req.body.teaches;
    let about = req.body.about;
    let it_kompetencer = req.body.it_kompetencer;
    let erhvervserfaring = req.body.erhvervserfaring;
    let tidligere_uddannelse = req.body.tidligere_uddannelse;
    let interesser = req.body.interesser;
    let offentlig = req.body.tilgaengelighed;
    let postcode = req.body.postcode;
    let tidligere_projekter = req.body.tidligere_projekter;

    let emailWrittenCorrectly = emailRegex.test(email);
    let phoneCheck = phoneRegex.test(telefon);
    let linkedInKorrekt = linkedIn.length !== 0 ? linkRegex.test(linkedIn) : true;
    let postcodeKorrekt = postcode.length !== 0 ? postcodeRegex.test(postcode) : true;

    if (!emailWrittenCorrectly || !phoneCheck || !email || !overskrift ||
        !sprog || !arbejdssted || !stilling || !tidligere_uddannelse || !erhvervserfaring ||
        !uddannelse || !it_kompetencer || !linkedInKorrekt || !postcodeKorrekt) {
        return res.send('One or more values in the form are missing');
    }

    let lang = reqLang(req, res);
    let besked = lang !== 'en' ? "CV'et er gemt." : "The CV is saved."

    let geo_lat;
    let geo_lon;
    let city;

    if (postcode.length != 0) {
        const url = 'https://dawa.aws.dk/postnumre?nr=' + postcode;
        const res = await fetch(url);
        const data = await res.json();//assuming data is json
        if (data[0].hasOwnProperty('href')) {
            geo_lat = +data[0].visueltcenter[1];
            geo_lon = +data[0].visueltcenter[0];
            city = data[0].navn;
        } else {
            geo_lat = null;
            geo_lon = null;
            city = null;
        }
    } else {
        postcode = null;
        geo_lat = null;
        geo_lon = null;
        city = null;
    }


    let professor_id = professor.id

    let json = {
        overskrift,
        about,
        teaches,
        arbejdssted,
        stilling,
        uddannelse,
        email,
        sprog,
        telefon,
        linkedIn,
        it_kompetencer,
        erhvervserfaring,
        tidligere_uddannelse,
        interesser,
        offentlig,
        professor_id,
        postcode,
        city,
        geo_lat,
        geo_lon,
        tidligere_projekter
    }

    const [cv, created] = await db.ProfessorCV.findOrCreate({
        where: {
            professor_id: professor.id
        },
        defaults: json
    });

    if (!created) {
        await db.ProfessorCV.update(json, {
            where: {
                id: cv.id
            }
        })
    }

    let status = lang !== 'en' ? 'Succes' : 'Success';

    res.render('professor-cv-success', {layout: false, status: status, message: besked, id: cv.id});
});

router.get('/edit', authorizeUser('professor'), async function (req, res, next) {
    let professor = res.locals.user;

    if (professor.cv == null) {
        res.status(403).render('error403', {layout: false});
    }

    res.render('professor-cv', {
        language: reqLang(req, res),
        uddannelse: professor.cv.uddannelse,
        arbejdssted: professor.cv.arbejdssted,
        stilling: professor.cv.stilling,
        profil: professor.fornavn + " " + professor.efternavn,
        overskrift: professor.cv.overskrift,
        email: professor.cv.email,
        sprog: professor.cv.sprog,
        telefon: professor.cv.telefon,
        linkedIn: professor.cv.linkedIn,
        about: professor.cv.about,
        it_kompetencer: professor.cv.it_kompetencer,
        erhvervserfaring: professor.cv.erhvervserfaring,
        tidligere_uddannelse: professor.cv.tidligere_uddannelse,
        tidligere_projekter: professor.cv.tidligere_projekter,
        interesser: professor.cv.interesser,
        offentlig: professor.cv.offentlig,
        postcode: professor.cv.postcode,
    })
});

module.exports = router;
