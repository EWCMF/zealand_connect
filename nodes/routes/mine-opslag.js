var express = require('express');
var router = express.Router();
const hbs = require('handlebars');
const fs = require('fs');
const db = require('../models');
var formidable = require("formidable");
const limit = 5;
const {
    Op
} = require('sequelize');
const path = require('path');
const {
    reqLang
} = require('../public/javascript/request');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;

router.get('/', authorizeUser('company', 'admin'), async function (req, res, next) {

    var page;
    var offset;
    if (req.query.page == null) {
        page = 1
        offset = 0;
    } else {
        page = req.query.page
        offset = (page - 1) * limit;
    }

    const user = res.locals.user
    const {
        count,
        rows
    } = await db.InternshipPost.findAndCountAll({
        limit: limit,
        raw: true,
        nest: true,
        offset: offset,
        order: [
            ['updatedAt', 'DESC']
        ],
        include: [{
                model: db.Virksomhed,
                as: 'virksomhed'
            },
            {
                model: db.Uddannelse,
                as: 'education'
            }
        ],
        where: {
            fk_company: user.id
        }

    });

    let pageCount = Math.ceil(count / limit);
    let withPages = pageCount > 1 ? true : false;
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        if (element['post_start_date'].length > 0) {
            let cropStart = element['post_start_date'].substring(0, 10);

            let startYear = cropStart.substring(0, cropStart.indexOf('-'));
            let startMonth = cropStart.substring(cropStart.indexOf('-') + 1, cropStart.lastIndexOf('-'));
            let startDay = cropStart.substring(cropStart.lastIndexOf('-') + 1);

            element['post_start_date'] = startDay + '/' + startMonth + '/' + startYear;
        }

        if (element['post_end_date'] != null && element['post_end_date'].length > 0) {
            let cropEnd = element['post_end_date'].substring(0, 10);

            let endYear = cropEnd.substring(0, cropEnd.indexOf('-'));
            let endMonth = cropEnd.substring(cropEnd.indexOf('-') + 1, cropEnd.lastIndexOf('-'));
            let endDay = cropEnd.substring(cropEnd.lastIndexOf('-') + 1);
            element['post_end_date'] = endDay + '/' + endMonth + '/' + endYear;
        }

        switch (element['post_type']) {
            case 1:
                element['post_type'] = 'Praktik';
                break;
            case 2:
                element['post_type'] = 'Studiejob';
                break;
            case 3:
                element['post_type'] = 'Trainee';
        }

    }

    res.render('mine-opslag', {
        language: reqLang(req, res),
        json: rows,
        pagination: {
            page: page,
            pageCount: pageCount
        },
        withPages
    });

});

router.post('/query', authorizeUser('company', 'admin'), function (req, res) {
    const user = res.locals.user

    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        var page = parseInt(fields.page);
        var offset;

        if (page == 1) {
            offset = 0
        } else {
            offset = (page - 1) * limit;
        }

        const {
            count,
            rows
        } = await db.InternshipPost.findAndCountAll({
            limit: limit,
            raw: true,
            nest: true,
            offset: offset,
            order: [
                ['updatedAt', 'DESC']
            ],
            include: [{
                    model: db.Virksomhed,
                    as: 'virksomhed'
                },
                {
                    model: db.Uddannelse,
                    as: 'education'
                }
            ],
            where: {
                fk_company: user.id
            }
        });

        var item = [count];

        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];

            if (element['post_start_date'].length > 0) {
                let cropStart = element['post_start_date'].substring(0, 10);
    
                let startYear = cropStart.substring(0, cropStart.indexOf('-'));
                let startMonth = cropStart.substring(cropStart.indexOf('-') + 1, cropStart.lastIndexOf('-'));
                let startDay = cropStart.substring(cropStart.lastIndexOf('-') + 1);
    
                element['post_start_date'] = startDay + '/' + startMonth + '/' + startYear;
            }
    
            if (element['post_end_date'] != null && element['post_end_date'].length > 0) {
                let cropEnd = element['post_end_date'].substring(0, 10);
    
                let endYear = cropEnd.substring(0, cropEnd.indexOf('-'));
                let endMonth = cropEnd.substring(cropEnd.indexOf('-') + 1, cropEnd.lastIndexOf('-'));
                let endDay = cropEnd.substring(cropEnd.lastIndexOf('-') + 1);
                element['post_end_date'] = endDay + '/' + endMonth + '/' + endYear;
            }
    
            switch (element['post_type']) {
                case 1:
                    element['post_type'] = 'Praktik';
                    break;
                case 2:
                    element['post_type'] = 'Studiejob';
                    break;
                case 3:
                    element['post_type'] = 'Trainee';
            }
        }

        fs.readFileAsync = function (filename) {
            return new Promise(function (resolve, reject) {
                fs.readFile(filename, function (err, data) {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            });
        };

        function getFile(filename) {
            return fs.readFileAsync(filename, 'utf8');
        }

        getFile(path.normalize('views/partials/search-praktik-card.hbs')).then((data) => {
            let template = hbs.compile(data + '');
            let html = template({
                json: rows
            });
            item.push(html);

            getFile(path.normalize('views/partials/search-pagination.hbs')).then((data) => {
                hbs.registerHelper('paginate', require('handlebars-paginate'));
                let template = hbs.compile(data + '');

                let pageCount = Math.ceil(count / limit);
                let withPages = pageCount > 1 ? true : false;

                let html = template({
                    pagination: {
                        page: page,
                        pageCount: pageCount
                    },
                    withPages
                });

                item.push(html);
                res.send(item);
            });
        });
    });
});

module.exports = router;