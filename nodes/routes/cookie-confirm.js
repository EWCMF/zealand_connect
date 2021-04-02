var express = require('express');
var router = express.Router();
var formidable = require("formidable");

router.post('/', async function (req, res, next) {
    
    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        let noLang = false;
        if (fields.preference === undefined) {
            res.cookie('cookie_consent', 'nolang', {
                maxAge: 1000 * 60 * 60 * 24 * 30
            });
            noLang = true;
        } else {
            res.cookie('cookie_consent', 'all', {
                maxAge: 1000 * 60 * 60 * 24 * 30
            });
        }

        if (!noLang && fields.lang === 'en') {
            res.redirect('/language/en');
        } else {
            res.status(200).end();
        }
    });
});

module.exports = router;