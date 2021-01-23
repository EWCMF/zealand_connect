const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', function (req, res, next) {
    res.render('view_post')
});

router.get('/:id', async function (req, res) {
    let id = req.params.id

    let result = await models.InternshipPost.findByPk(id, {
        nest: true,
        attributes: ["title", "email", "contact", "fk_education",
            "country", "region", "post_start_date", "post_end_date", "post_text", "city", "postcode",
            "company_link", "post_document", "fk_company"],
        include: [{
            model: models.Virksomhed,
            as: 'virksomhed'
        },
        {
            model: models.Uddannelse,
            as: 'education'
        }]
    });

    let educationId = result.fk_education;

    let education = await models.Uddannelse.findByPk(educationId);

    //Tilføjer https:// bag på links hvis det mangler på weblink i databasen.
    let webLink = result['company_link'];
    if (webLink != null) {
        if (!webLink.includes("https://") && !webLink.includes("http://")) {
        webLink = "https://" + webLink
        }
    }

    let countryId = result.country;
    let country;
    let isDenmark = false;
    switch (countryId) {
        case 1: country = "Danmark"; isDenmark = true; break;
        case 2: country = "Tyskland"; break;
        case 3: country = "Sverige"; break;
        case 4: country = "Udlandet"; break;
        default: country = "Ikke angivet";
    }

    let ejer = false;
    if (req.user != null) {
        var found = res.locals.user;
        if (found instanceof models.Virksomhed && found.id == result.fk_company) {
            ejer = true;
        }
    }

    let rdocName
    if (result.post_document != null) {

        rdocName = result.post_document.replace(/^.*_/, "");
    }
    

    //når vi kalder noget r, f.eks. rtitle eller remail er det for at refere til resultat så der principelt set kommer til at stå "result email"
    res.render('internship_post_view', {
        title: result['title'],
        rid: id,
        rtitle: result['title'],
        remail: result['email'],
        rcontact: result['contact'],
        reducation: education.name,
        rcountry: country,
        rregion: result['region'],
        rpoststart/*start date*/: result['post_start_date'],
        rpostend:/*end date*/ result['post_end_date'],
        rtext/*post_text*/: result['post_text'],
        rcity: result['city'],
        rpostcode: result['postcode'],
        rcvr: result.virksomhed.cvrnr,
        rcompany: webLink,
        rlogo: result.virksomhed.logo,
        rdoc: result["post_document"],
        rdocName: rdocName,
        isDenmark: isDenmark,
        ejer: ejer
    });

    //TODO: Fiks dette rod

});

module.exports = router;
