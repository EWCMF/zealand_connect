var express = require('express');
var router = express.Router();
const db = require('../models');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
var { reqLang } = require('../public/javascript/request');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;
const { emailRegex, phoneRegex } = require('../constants/regex');

router.get('/', authorizeUser('student'), async function (req, res, next) {
    if (req.user == null) {
        res.status(403).render('error403', {layout: false});
    }

    var student = res.locals.user;

    if (student.cv == null) {
        const udd = await db.Uddannelse.findAll({
            order: [
                ['name', 'ASC']
            ]
        });

        return res.render('mit-cv', {
            language: reqLang(req, res),
            profil: student.fornavn + " " + student.efternavn,
            telefon: student.tlfnr,
            email: student.email,
            uddannelser: udd
        })
    }

    db.CV.findOne({
        raw: true,
        nest: true,
        where: {
            id: parseInt(student.cv.id)
        },
        include: [{
            model: db.Student,
            as: 'student'
        },
        {
            model: db.Uddannelse,
            as: 'education'
        }]
    }).then((cv) => {

        res.redirect('/search-cv/' + cv.id);

    });
});

router.get('/edit', authorizeUser('student'), async function (req, res, next) {
    if (req.user == null) {
        res.status(403).render('error403', {layout: false});
    }

    var student = res.locals.user;

    const udd = await db.Uddannelse.findAll({
        order: [
            ['name', 'ASC']
        ]
    });

    if (student.cv == null) {
        res.status(403).render('error403', {layout: false});
    }

    res.render('mit-cv', {
        language: reqLang(req, res),
        uddannelser: udd,
        uddannelse: student.cv.education.name,
        profil: student.fornavn + " " + student.efternavn,
        overskrift: student.cv.overskrift,
        email: student.cv.email,
        sprog: student.cv.sprog,
        speciale: student.cv.speciale,
        telefon: student.cv.telefon,
        yt_link: student.cv.yt_link,
        linkedIn: student.cv.linkedIn,
        om: student.cv.om_mig,
        it_kompetencer: student.cv.it_kompetencer,
        u_og_fa: student.cv.udenlandsophold_og_frivilligt_arbejde,
        erhvervserfaring: student.cv.erhvervserfaring,
        tidligere_uddannelse: student.cv.tidligere_uddannelse,
        hjemmeside: student.cv.hjemmeside,
        fritidsinteresser: student.cv.fritidsinteresser,
        offentlig: student.cv.offentlig
    })
});

router.post('/submit', authorizeUser('student'), async function (req, res, next) {

    if (req.user == null) {
        res.status(403).render('error403', {layout: false});
    }

    var student = res.locals.user;

    let overskrift = req.body.overskrift;
    let fk_education = req.body.uddannelse;
    let email = req.body.email;
    let sprog = req.body.sprog;
    let speciale = req.body.speciale;
    let telefon = req.body.telefon;
    let linkedIn = req.body.linkedIn;
    let yt_link = req.body.youtube_link;
    let om_mig = req.body.om;
    let it_kompetencer = req.body.iT_Kompetencer;
    let udenlandsophold_og_frivilligt_arbejde = req.body.UogFA;
    let erhvervserfaring = req.body.erhvervserfaring;
    let tidligere_uddannelse = req.body.tidligere_uddannelse;
    let hjemmeside = req.body.hjemmeside;
    let fritidsinteresser = req.body.fritidsinteresser;
    let offentlig = req.body.tilgaengelighed;

    let emailWrittenCorrectly = emailRegex.test(email);
    let phoneCheck = phoneRegex.test(telefon);
    let medOverskrift = !overskrift == "";
    let medSprog = !sprog == "";
    let medUddannelse = !fk_education == 0;
    let medTidligere_uddannelse = !tidligere_uddannelse == "";
    let medIt_kompetencer = !it_kompetencer == ""

    if (!emailWrittenCorrectly || !phoneCheck || !medOverskrift || !medSprog || !medUddannelse || !medTidligere_uddannelse || !medIt_kompetencer) {
        res.send('One or more values in the form are missing');
    }

    let gyldig;
    let besked;

    if (overskrift == '' || fk_education == 0 ||
        email == '' || sprog == '' || telefon == '' ||
        it_kompetencer == '' || tidligere_uddannelse == '') {
        gyldig = false;
        besked = "CV'et er gemt men er utilgængeligt for andre indtil alle nødvendige felter er udfyldte."
    } else {
        gyldig = true;
        besked = "CV'et er gemt."
    }

    var student_id = student.id

    var json = {
        overskrift,
        fk_education,
        email,
        sprog,
        speciale,
        telefon,
        linkedIn,
        yt_link,
        om_mig,
        it_kompetencer,
        udenlandsophold_og_frivilligt_arbejde,
        erhvervserfaring,
        tidligere_uddannelse,
        hjemmeside,
        fritidsinteresser,
        offentlig,
        gyldig,
        student_id
    }

    const [cv, created] = await db.CV.findOrCreate({
        where: {
            student_id: student.id
        },
        defaults: json
    });

    if (!created) {
        await db.CV.update(json, {
            where: {
                id: cv.id
            }
        })

        if (gyldig) {
            besked = 'Ændringer er gemt.'
        } else {
            besked = "Ændringer er gemt men CV'et er ikke gyldigt mere og vil derfor ikke vises på søgelisten."
        }
        
    }

    res.render('mit-cv-success', {layout: false, status: 'Succes', message: besked, id: cv.id});
});

router.get('/delete', authorizeUser('student', 'admin'), function (req, res, next) {
    if (req.query.id == null) {
        res.send("Use id");
    } else {
        db.CV.destroy({
            where: {
                id: req.query.id
            }
        });
        res.send("Entry deleted");
    }
});

router.post('/preview', authorizeUser('student'), async function (req, res, next) {
    let student = await findUserByEmail(req.user);

    let udd = await db.Uddannelse.findByPk(req.body.uddannelse, {
        attributes: ["name"]
    });
    if (udd == null) {
        udd = {
            name: ''
        }
    };

    let json = {
        student: {
            profilbillede: student.profilbillede,
            fornavn : student.fornavn,
            efternavn : student.efternavn
        },
        overskrift : req.body.overskrift,
        education: {
            name: udd.name
        },
        email : req.body.email,
        sprog : req.body.sprog,
        speciale : req.body.speciale,
        telefon : req.body.telefon,
        linkedIn : req.body.linkedIn,
        yt_link : req.body.youtube_link,
        om_mig : req.body.om,
        it_kompetencer : req.body.iT_Kompetencer,
        udenlandsophold_og_frivilligt_arbejde : req.body.UogFA,
        erhvervserfaring : req.body.erhvervserfaring,
        tidligere_uddannelse : req.body.tidligere_uddannelse,
        hjemmeside : req.body.hjemmeside,
        fritidsinteresser : req.body.fritidsinteresser,
    };

    res.render('cv', {
        language: reqLang(req, res),
        json: json,
        navDisabled: true,
        noButtons: true,
        disableSidebarButton: true
    });

})

module.exports = router;
