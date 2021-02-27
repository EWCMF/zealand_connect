const express = require('express');
const router = express.Router();
const {
    reqLang
} = require('../public/javascript/request');
const {
    emailRegex
} = require('../constants/regex');
const nodemailer = require('nodemailer');

router.get('/', function (req, res, next) {
    let msg = req.query.success;

    if (msg !== null && msg !== undefined) {
        return res.render('forgot-password', {
            language: reqLang(req, res),
            message: "En mail er blevet sendt"
        });
    }

    res.render('forgot-password', {
        language: reqLang(req, res)
    });
});

router.post('/', function (req, res) {
    let mail = req.body.mail;

    if (mail.length == 0 || !emailRegex.test(mail)) {
        return res.send('One or more fields are invalid');
    }

    // const transport = nodemailer.createTransport({
        
    // });

    // const message = {
        
    // };

    // transport.sendMail(message, function (err, info) {
        
    // });

    res.redirect('/forgot-password?success=true');
})

module.exports = router;