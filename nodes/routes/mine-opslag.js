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


async function fetchData(page, req, res) {
    const user = res.locals.user
    let offset;

    if (!page) {
        page = 1
        offset = 0;
    }  else {
        offset = (page - 1) * limit;
    };

    const {
        count,
        rows
    } = await db.InternshipPost.findAndCountAll({
        limit: limit,
        nest: true,
        distinct: true,
        offset: offset,
        order: [
            ['updatedAt', 'DESC'],
            [{
                model: db.Education
            }, 'name', 'ASC']
        ],
        include: [{
                model: db.Virksomhed,
                as: 'virksomhed'
            },
            {
                model: db.Education,
                attributes: ['name'],
                through: db.InternshipPost_Education,
            },
        ],
        where: {
            fk_company: user.id
        }
    });

    let pageCount = Math.ceil(count / limit);

    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        element.mineOpslag = true;

        let formatDate = new Date(element['updatedAt']);
        let leadingZeroDay = formatDate.getDate() < 10 ? '0' : '';
        let leadingZeroMonth = (formatDate.getMonth() + 1) < 10 ? '0' : '';

        let newDate = leadingZeroDay + formatDate.getDate() + "/" + leadingZeroMonth + (formatDate.getMonth() + 1) + "/" + formatDate.getFullYear();
        element.formattedDate = newDate;

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

    return {
        count: count,
        page: page,
        pageCount: pageCount,
        rows: rows
    };
}

router.get('/', authorizeUser('company', 'admin'), async function (req, res, next) {

    let data = await fetchData(req.query.page, req, res);

    let count = data.count;
    let page = data.page;
    let pageCount = data.pageCount;
    let rows = data.rows;

    let withPages = pageCount > 1 ? true : false;

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

    let formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        let data = await fetchData(fields.page, req, res)

        let count = data.count;
        let page = data.page;
        let pageCount = data.pageCount;
        let rows = data.rows; 

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

        getFile(path.normalize('views/partials/search-praktik-card.hbs')).then((data) => {
            hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
                switch (operator) {
                    case '==':
                        return (v1 == v2) ? options.fn(this) : options.inverse(this);
                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (v1 != v2) ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            });
            let template = hbs.compile(data + '');
            let html = template({
                json: rows
            }, {
                allowProtoPropertiesByDefault: true
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
});

router.post("/toggle-visibility", authorizeUser("company"), async function (req, res) {
    console.log(req.body);
    let id = Number(req.body)

    let internshipPost = await db.InternshipPost.findByPk(id);

    if (res.locals.user.id !== internshipPost.fk_company) {
        return res.status(403);
    }

    internshipPost.visible = !internshipPost.visible;
    await internshipPost.save();

    res.send(internshipPost.visible);
});

module.exports = router;