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
const { validatePasswordLength, checkForIdenticals} = require('../validation/input-validation');

router.get('/', async function (req, res, next) {
    let email = req.query.email;
    let token = req.query.token;

    if (email === undefined || token === undefined){
        return res.sendStatus(404);
    }

    // Destroy expired tokens (expiration date is more than one hour ago)
    await models.ResetToken.destroy({
        where: {
            expiration: {
                [Op.lt]: new Date()
            },
        }
    });

    let record = await models.ResetToken.findOne({
        where: {
            email: email,
            expiration: {[Op.gt]: Sequelize.fn('CURDATE')},
            token: token,
            used: 0
        }
    });

    if (record == null) {
        return res.render('reset-password', {
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
    let password2 = req.body.gentagPassword;
    let email = req.body.email;
    let token = req.body.token;

    if (!checkForIdenticals(password, password2)){
        return res.json({status: 'error', message: 'Passwords do not match. Please try again.'});
    }
    if (!validatePasswordLength(password)){
        return res.json({status: 'error', message: 'Password length is incorrect.'});
    }

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

    res.render('reset-password-success', {
        language: reqLang(req, res)
    });
})

module.exports = router;