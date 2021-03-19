const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { reqLang } = require('../public/javascript/request');

function sendMail(template, mailInfos) {
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

    mailInfos.forEach(mailInfo => {
        const message = {
            from: "noreply@connect.zealand.dk",
            to: mailInfo.recipient,
            subject: mailInfo.subject,
            template: template,
            context: mailInfo.context
        }
        
        transport.sendMail(message, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });
    });
}

module.exports = { sendMail }