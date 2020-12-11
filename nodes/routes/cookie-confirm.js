var express = require('express');
var router = express.Router();
var formidable = require("formidable");

router.post('/', async function (req, res, next) {
    
    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        if (fields.preference === undefined) {
            res.cookie('cookie_consent', 'nolang');
        } else {
            res.cookie('cookie_consent', 'all');
        }

        res.status(200).end();
    });
});

module.exports = router;