const express = require('express');
const router = express.Router();
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const {
    reqLang
} = require('../public/javascript/request');
const {
    emailRegex
} = require('../constants/regex');
const nodemailer = require('nodemailer');
const models = require('../models');
const crypto = require('crypto');

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

router.post('/', async function (req, res) {
    let email = req.body.email;

    if (email.length === 0 || !emailRegex.test(email)) {
        return res.send('One or more fields are invalid');
    }

    let user = await findUserByEmail(email);
    if (user == null) {
        return res.send('User not found');
    }

    await models.ResetToken.update({
            used: 1
        },
        {
            where: {
                email: email
            }
        });

    let token = crypto.randomBytes(64).toString('base64');
    let expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1/24);

    let resetToken = await models.ResetToken.create({
        email: email,
        expiration: expireDate,
        token: token,
        used: 0
    });

    const transport = nodemailer.createTransport({
        // host: process.env.EMAIL_HOST,
        // port: 465,
        // secure: true,
        // secureConnection: true,
        // auth: {
        //     user: process.env.EMAIL_USER,
        //     pass: process.env.EMAIL_PASS
        // }
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "96bd55c2e1698c",
            pass: "b49a962c9d9f1b"
        }
    });

    const message = {
        from: "noreply@connect.zealand.dk",
        to: email,
        subject: "Genstart password på Zealand Connect",
        text: "Tryk på dette link for at genstarte dit password:\n\nhttps://" + "localhost/reset-password?token="+encodeURIComponent(token)+"&email=" + email,
    };

    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });

    res.redirect('/forgot-password?success=true');
})

module.exports = router;