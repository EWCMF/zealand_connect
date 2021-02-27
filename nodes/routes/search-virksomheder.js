const express = require('express');
const router = express.Router();
const hbs = require('handlebars');
const fs = require('fs');
const formidable = require("formidable");
const path = require('path');
const {
    reqLang
} = require('../public/javascript/request');
const {
    Virksomhed
} = require('../models');
const limit = 20;
const handleWhere = function () {

}

router.get('/', async function (req, res, next) {

    let page;
    let offset;
    if (req.query.page == null) {
        page = 1
        offset = 0;
    } else {
        page = req.query.page
        offset = (page - 1) * limit;
    }

    let sort;
    if (req.query.sort == null) {
        sort = "navn"
    } else {
        sort = req.query.sort;
    }

    let order;
    if (req.query.order == null) {
        order = "ASC"
    } else {
        order = req.query.order
    }


    const {
        count,
        rows
    } = await Virksomhed.findAndCountAll({
        limit: limit,
        raw: true,
        offset: offset,
        order: [
            [sort, order]
        ],
        where: {
            visible: true
        }
    });

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    let pageCount = Math.ceil(count / limit);
    let withPages = pageCount > 1 ? true : false;
    res.render('search-virksomheder', {
        language: reqLang(req, res),
        resultater: count,
        json: rows,
        pagination: {
            page: page,
            pageCount: pageCount
        },
        withPages,
        url: fullUrl
    });
});

router.post('/query', function (req, res) {

    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        let page = parseInt(fields.page);
        let offset;

        if (page == 1) {
            offset = 0
        } else {
            offset = (page - 1) * limit;
        }

        let sort;
        if (fields.sort == null) {
            sort = "navn"
        } else {
            sort = fields.sort;
        }

        let order;
        if (fields.order == null) {
            order = "ASC"
        } else {
            order = fields.order
        }

        const {
            count,
            rows
        } = await Virksomhed.findAndCountAll({
            limit: limit,
            raw: true,
            offset: offset,
            order: [
                [sort, order]
            ],
            where: {
                visible: true
            }
        });

        let item = [count];

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

        getFile(path.normalize('views/partials/search-virksomhed-card.hbs')).then((data) => {
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
})

module.exports = router;