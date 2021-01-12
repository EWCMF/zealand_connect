
var express = require('express');
var router = express.Router();
const db = require('../models');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;

router.get('/', async function (req, res, next) {
    if (req.user == null) {
        res.status(403).render('error403', {layout: false});
    }

    var student = await findUserByEmail(req.user);

    if (student.cv == null) {
        const udd = await db.Uddannelser.findAll({
            order: [
                ['name', 'ASC']
            ]
        });

        res.render('mit-cv', {
            profil: student.fornavn + " " + student.efternavn,
            uddannelser: udd
        })
    }

    db.CV.findOne({
        raw: true,
        nest: true,
        where: {
            id: parseInt(student.cv.id)
        },
        include: {
            model: db.Student,
            as: 'student'
        }
    }).then((cv) => {

        res.redirect('/search-cv/' + cv.id);

    });
});

router.get('/edit', async function (req, res, next) {
    if (req.user == null) {
        res.status(403).render('error403', {layout: false});
    }

    var student = await findUserByEmail(req.user);

    const udd = await db.Uddannelser.findAll({
        order: [
            ['name', 'ASC']
        ]
    });

    if (student.cv == null) {
        res.status(403).render('error403', {layout: false});
    }

    res.render('mit-cv', {
        uddannelser: udd,
        uddannelse: student.cv.uddannelse,
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

router.post('/submit', async function (req, res, next) {

    if (req.user == null) {
        res.status(403).render('error403', {layout: false});
    }

    var student = await findUserByEmail(req.user)

    let overskrift = req.body.overskrift;
    let uddannelse = req.body.uddannelse;
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

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
    const numbersRegex = /^[0-9]{8}$/;

    var emailWrittenCorrectly = emailRegex.test(email);
    var numbersOnly = numbersRegex.test(telefon);
    var medOverskrift = !overskrift == "";
    var medSprog = !sprog == "";
    var medUddannelse = !uddannelse == "";
    var medTidligere_uddannelse = !tidligere_uddannelse == "";
    var medIt_kompetencer = !it_kompetencer == ""

    if (!emailWrittenCorrectly || !numbersOnly || !medOverskrift || !medSprog || !medUddannelse || !medTidligere_uddannelse || !medIt_kompetencer) {
        res.send('One or more values in the form are missing');
    }

    var gyldig;
    var besked;

    if (overskrift == '' || uddannelse == '' ||
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
        uddannelse,
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

router.get('/delete', function (req, res, next) {
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

router.post('/Preview', async function (req, res, next) {
    var student = await findUserByEmail(req.user);

    res.render('cv_Preview', {
    fornavn : student.fornavn,
    efternavn : student.efternavn,
    overskrift : req.body.overskrift,
    uddannelse : req.body.uddannelse,
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
    offentligCheckbox : req.body.offentligCheckBox,
    navDisabled: true
})

})

module.exports = router;
