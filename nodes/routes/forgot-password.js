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

    console.log(process.env.EMAIL_HOST);
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        secureConnection: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    console.log(mail);

    const message = {
        from: "noreply@connect.zealand.dk",
        to: mail,
        subject: "Genstart password på Zealand Connect",
        text: "Tryk på dette link for at genstarte dit password: link"
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