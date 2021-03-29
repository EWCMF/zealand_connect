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

async function fetchData(page, parameters) {
    
    let offset;
    if (!page) {
        page = 1;
        offset = 0;
    } else {
        offset = (page - 1) * limit;
    };

    let sort;
    if (!parameters.sort) {
        sort = "navn";
    } else {
        sort = parameters.sort;
    };

    let order;
    if (!parameters.order) {
        order = "ASC"
    } else {
        order = parameters.order
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

    let pageCount = Math.ceil(count / limit);

    return {
        count: count,
        page: page,
        pageCount: pageCount,
        rows: rows
    }

}

router.get('/', async function (req, res, next) {

    let data = await fetchData(req.query.page, req.query);

    let count = data.count;
    let page = data.page;
    let pageCount = data.pageCount;
    let rows = data.rows;

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

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

    let formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        let fetchedData = await fetchData(parseInt(fields.page), fields); 
        
        let count = fetchedData.count;
        let page = fetchedData.page;
        let pageCount = fetchedData.pageCount;
        let rows = fetchedData.rows;

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