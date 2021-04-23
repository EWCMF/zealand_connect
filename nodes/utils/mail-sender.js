const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.NODE_ENV === 'production',
    secureConnection: process.env.NODE_ENV === 'production',
    pool: true,
    maxMessages: 3,
    maxConnections: 1,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function sendMail(template, mailInfo) {
    
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
    

        const message = {
            from: process.env.EMAIL_FROM,
            to: mailInfo.recipient,
            subject: mailInfo.subject,
            template: template,
            context: mailInfo.context
        }
        
        return new Promise(function (resolve, reject) {
            transport.sendMail(message, function (err, info) {
                if (err) {
                    reject(err)
                    console.log(err);
                } else {
                    resolve(info)
                    console.log(info);
                }
            });
        });
    }

module.exports = { sendMail }