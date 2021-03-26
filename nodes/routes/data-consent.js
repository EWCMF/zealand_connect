const express = require('express');
const router = express.Router();
const models = require('../models');

router.post('/', async function (req, res, next) {
    let consent = req.body

    if (consent){
        await models.Student.update({
            user_data_consent: consent
        }, {
            where: {
                id: res.locals.user.id
            }
        })
    }
    return res.status(200).end();
});

module.exports = router;