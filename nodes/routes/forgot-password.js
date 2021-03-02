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

    const transport = nodemailer.createTransport({
        host: "mailgateway.sszcloud.dk",
        port: 25,
        requiresAuth: false,
        ignoreTLS: true,
        secure: false,
        secureConnection: false,
        tls: {
            rejectUnauthorized: false
        }
    });

    const message = {
        from: "noreply@connect.zealand.dk",
        to: mail,
        subject: "test",
        text: "test"
    };

    transport.sendMail(message, function (err, info) {
        if (err) { 
            console.log(err);
        } else {
            console.log('send mail');
            console.log(info); 
        }
    });
    console.log('route used');

    res.redirect('/forgot-password?success=true');
})

module.exports = router;