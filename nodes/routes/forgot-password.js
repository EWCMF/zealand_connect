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
const hbs = require('nodemailer-express-handlebars');

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

        const options = {
            viewEngine: {
                partialsDir: __dirname + "/../views/partials",
                layoutsDir: __dirname + "/../views/email-templates",
                extname: ".hbs"
            },
            extName: ".hbs",
            viewPath: "views/email-templates"
        };

        transport.use("compile", hbs(options));

        let subject, title, text, buttonText;

        if (reqLang(req, res) === 'da'){
            subject = "Nulstil adgangskode på Zealand Connect";
            title = "Nulstil adgangskode";
            text = "Følg dette link for at nulstille din adgangskode.";
            buttonText = "Nulstil adgangskode";
        } else {
            subject = "Reset password at Zealand Connect";
            title = "Reset password";
            text = "Follow this link to reset your password.";
            buttonText = "Reset password";
        }

        const message = {
            from: "noreply@connect.zealand.dk",
            to: email,
            subject: subject,
            template: 'password-recovery',
            context: {
                link: process.env.DOMAIN + "/reset-password?token="+encodeURIComponent(token)+"&email=" + email,
                title: title,
                text: text,
                buttonText: buttonText
            }
        };

        await transport.sendMail(message, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });
        res.redirect('/forgot-password?success=true');
    } else {
        res.redirect('/forgot-password?success=true');
    }
})

module.exports = router;