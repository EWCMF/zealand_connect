const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require('../models');
const {
    reqLang
} = require('../public/javascript/request');

router.get('/', async function(req, res, next){
    await models.ResetToken.destroy({
        where: {
            expiration: { [Op.lt]: Sequelize.fn('CURDATE')},
        }
    });

    let record = await models.ResetToken.findOne({
        where: {
            email: req.query.email,
            expiration: { [Op.gt]: Sequelize.fn('CURDATE')},
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

module.exports = router;