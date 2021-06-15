const express = require('express');
const router = express.Router();
const db = require('../models');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const deleteCV = require('../persistence/cv-mapping').deleteCV;
const { reqLang } = require('../public/javascript/request');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;
const { emailRegex, phoneRegex, linkRegex, postcodeRegex } = require('../constants/regex');
const fetch = require('node-fetch');

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

        return res.render('cv', {
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

    const CVtypes = await db.CV_CVtype.findAll({
        where: {
            cv_id: student.cv.id
        }
    })

    let cvtypes = [false, false, false, false];

    if (CVtypes.length > 0){
        CVtypes.forEach(element => {
            cvtypes[element.cvtype_id - 1] = true
        })
    }

    res.render('cv', {
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
        availability: student.cv.availability,
        postcode: student.cv.postcode,
        praktik: cvtypes[0],
        studiejob: cvtypes[1],
        trainee: cvtypes[2],
        fuldtid: cvtypes[3],
        post_subscription: student.cv.post_subscription
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
    let it_kompetencer = req.body.it_kompetencer;
    let udenlandsophold_og_frivilligt_arbejde = req.body.UogFA;
    let erhvervserfaring = req.body.erhvervserfaring;
    let tidligere_uddannelse = req.body.tidligere_uddannelse;
    let hjemmeside = req.body.hjemmeside;
    let fritidsinteresser = req.body.fritidsinteresser;
    let availability = req.body.tilgaengelighed;
    let postcode = req.body.postcode;
    let cvtypes = [req.body.praktikCheck, req.body.studiejobCheck, req.body.traineeCheck, req.body.fuldtidCheck]
    let post_subscription = req.body.post_subscription;

    let emailWrittenCorrectly = emailRegex.test(email);
    let phoneCheck = phoneRegex.test(telefon);
    let medOverskrift = !overskrift == "";
    let medSprog = !sprog == "";
    let medUddannelse = !fk_education == 0;
    let medTidligere_uddannelse = !tidligere_uddannelse == "";
    let medIt_kompetencer = !it_kompetencer == ""
    let hjemmesideKorrekt = hjemmeside.length != 0 ? linkRegex.test(hjemmeside) : true;
    let youtubeKorrekt = yt_link.length != 0 ? linkRegex.test(yt_link) : true;
    let linkedInKorrekt = linkedIn.length != 0 ? linkRegex.test(linkedIn) : true;
    let postcodeKorrekt = postcode.length != 0 ? postcodeRegex.test(postcode) : true;

    if (!emailWrittenCorrectly || !phoneCheck || !medOverskrift || !medSprog ||
        !medUddannelse || !medTidligere_uddannelse || !medIt_kompetencer ||
        !hjemmesideKorrekt || !youtubeKorrekt || !linkedInKorrekt || !postcodeKorrekt) {
        return res.send('One or more values in the form are missing');
    }

    let gyldig;
    let besked;
    let lang = reqLang(req, res);

    if (overskrift == '' || fk_education == 0 ||
        email == '' || sprog == '' || telefon == '' ||
        it_kompetencer == '' || tidligere_uddannelse == '') {
        gyldig = false;
        besked = lang != 'en' ? "CV'et er gemt men er utilgængeligt for andre indtil alle nødvendige felter er udfyldte." : "The CV is saved but is inaccessible for others until all required fields are filled."
    } else {
        gyldig = true;
        besked = lang != 'en' ? "CV'et er gemt." : "The CV is saved."
    }

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

    if (!post_subscription) {
        post_subscription = false;
    }

    let student_id = student.id

    let json = {
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
        availability,
        gyldig,
        student_id,
        postcode,
        city,
        geo_lat,
        geo_lon,
        post_subscription
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
            besked = lang != 'en' ? 'Ændringer er gemt.' : "The changes are saved"
        } else {
            besked = lang != 'en' ? "Ændringer er gemt men CV'et er ikke gyldigt mere og vil derfor ikke vises på søgelisten." : "The changes are saved but the CV isn't valid anymore and will not be shown in the search list."
        }

    }

    let status = lang != 'en' ? 'Succes' : 'Success';

    for (let i = 0; i < cvtypes.length; i++) {
        if (typeof cvtypes[i] !== 'undefined'){
            const [cvtype, cvtypeCreated] = await db.CV_CVtype.findOrCreate({
                where: {
                    cv_id: cv.id,
                    cvtype_id: i + 1
                }
            })

            if (!cvtypeCreated) {
                await db.CV_CVtype.update(json, {
                    where: {
                        cv_id: cv.id,
                        cvtype_id: i + 1
                    }
                })
            }
        } else {
            await db.CV_CVtype.destroy({
                where: {
                    cv_id: cv.id,
                    cvtype_id: i + 1
                }
            })
        }
    }

    res.render('cv-success', {layout: false, status: status, message: besked, id: cv.id});
});

router.get('/delete', authorizeUser('student'), async function (req, res, next) {
    let user = res.locals.user;

    if (user instanceof db.Student){
        try {
            let CV = await db.CV.findOne({
                where: {
                    student_id: user.id
                }
            })
            deleteCV(CV.id);
            return res.redirect('/');
        } catch (e) {
            console.log(e)
        }
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
        it_kompetencer : req.body.it_kompetencer,
        udenlandsophold_og_frivilligt_arbejde : req.body.UogFA,
        erhvervserfaring : req.body.erhvervserfaring,
        tidligere_uddannelse : req.body.tidligere_uddannelse,
        hjemmeside : req.body.hjemmeside,
        fritidsinteresser : req.body.fritidsinteresser,
        postcode: req.body.postcode
    };

    res.render('cv-view', {
        language: reqLang(req, res),
        json: json,
        navDisabled: true,
        noButtons: true,
        disableSidebarButton: true,
        hideFooter: true
    });

})

module.exports = router;
