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
            message: "Hvis brugeren eksisterer, vil du modtage en email med oplysninger til at nulstille kodeordet."
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
    if (user) {
        await models.ResetToken.update({
                used: 1
            },
            {
                where: {
                    email: email
                }
            });

        let token = crypto.randomBytes(64).toString('base64');

        // Set expire date to 1 hour from now
        let expireDate = new Date();
        expireDate.setHours(expireDate.getHours() +1)

        let resetToken = await models.ResetToken.create({
            email: email,
            expiration: expireDate,
            token: token,
            used: 0
        });

        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.NODE_ENV === 'production',
            secureConnection: process.env.NODE_ENV === 'production',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const message = {
            from: "noreply@connect.zealand.dk",
            to: email,
            subject: "Nulstil password på Zealand Connect",
            text: "Følg dette link for at genstarte dit password:\n\n" + process.env.DOMAIN + "/reset-password?token="+encodeURIComponent(token)+"&email=" + email,
        };

        transport.sendMail(message, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });
        res.redirect('/forgot-password?success=true');
    }

    res.redirect('/forgot-password?success=true');
})

module.exports = router;