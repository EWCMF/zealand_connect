const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require('../models');
const {
    reqLang
} = require('../public/javascript/request');
const hashPassword = require('../encryption/password').hashPassword;
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;

router.get('/', async function (req, res, next) {
    await models.ResetToken.destroy({
        where: {
            expiration: {[Op.lt]: Sequelize.fn('CURDATE')},
        }
    });

    let record = await models.ResetToken.findOne({
        where: {
            email: req.query.email,
            expiration: {[Op.gt]: Sequelize.fn('CURDATE')},
            token: req.query.token,
            used: 0
        }
    });

    if (record == null) {
        return res.render('user/reset-password', {
            message: 'Token has expired. Please try password reset again.',
            showForm: false
        });
    }

    res.render('reset-password', {
        language: reqLang(req, res),
        showForm: true,
        record: record
    });
})

router.post('/', async function (req, res, next) {
    let password = req.body.password;
    let email = req.body.email;
    let token = req.body.token;

    console.log(password)
    console.log(email)
    console.log(token)

    const record = await models.ResetToken.findOne({
        where: {
            email: email,
            expiration: {[Op.gt]: Sequelize.fn('CURDATE')},
            token: token,
            used: 0
        }
    });

    if (record == null) {
        return res.json({status: 'error', message: 'Token not found. Please try the reset password process again.'});
    }

    await models.ResetToken.update({
            used: 1
        },
        {
            where: {
                email: email
            }
        });

    const user = await findUserByEmail(email);

    if (user instanceof models.Student){
        models.Student.update({
            password: await hashPassword(password)
        }, {
            where: {
                email: email
            }
        });
    } else if (user instanceof models.Virksomhed){
        models.Virksomhed.update({
            password: await hashPassword(password)
        }, {
            where: {
                email: email
            }
        });
    } else {
        return res.json({status: 'error', message: 'There was an error. Please try again.'});
    }

    return res.json({status: 'ok', message: 'Password reset. Please login with your new password.'});
})

module.exports = router;