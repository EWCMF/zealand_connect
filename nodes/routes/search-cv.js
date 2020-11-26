var express = require('express');
var router = express.Router();
var hbs = require('handlebars');
var fs = require('fs');
const db = require('../models');
var formidable = require("formidable");
const limit = 5;
const {
    Op
} = require('sequelize');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;


router.get('/', async function (req, res, next) {

    var page;
    var offset;
    if (req.query.page == null) {
        page = 1
        offset = 0;
    } else {
        page = req.query.page
        offset = (page - 1) * limit;
    }

    const udd = await db.Uddannelser.findAll({
        order: [
            ['name', 'ASC']
        ]
    });

    const {
        count,
        rows
    } = await db.CV.findAndCountAll({
        limit: limit,
        raw: true,
        nest: true,
        offset: offset,
        order: [
            ['updatedAt', 'DESC']
        ],
        include: {
            model: db.Student,
            as: 'student'
        }
    });

    let pageCount = Math.ceil(count / limit);
    let withPages = pageCount > 1 ? true : false;

    res.render('search_cv', {
        json: rows,
        resultater: count,
        udd: udd,
        pagination: {
            page: page,
            pageCount: pageCount
        },
        withPages
    });

});

router.post('/query', function (req, res) {

    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        var where = {}
        var uddannelse = {
            [Op.or]: []
        };
        var sprog = {
            [Op.or]: []
        };

        for (var key in fields) {
            const element = key + "";
            if (element.includes("udd")) {

                uddannelse[Op.or].push(element.substring(3));
            }

            if (element.includes('indland')) {

                sprog[Op.or].push(
                    'dansk'
                );
                sprog[Op.or].push(
                    'Dansk'
                )
            }

            if (element.includes('udland')) {

                sprog[Op.or].push({
                    [Op.not]: 'dansk'
                })

                sprog[Op.or].push({
                    [Op.not]: 'Dansk'
                })
            }
        }

        where = {
            uddannelse,
            sprog
        }

        var page = 1;
        var offset;

        if (page == 1) {
            offset = 0
        } else {
            offset = (page - 1) * limit;
        }

        const {
            count,
            rows
        } = await db.CV.findAndCountAll({
            limit: limit,
            raw: true,
            nest: true,
            offset: offset,
            order: [
                [fields.sort, fields.order]
            ],
            where,
            include: {
                model: db.Student,
                as: 'student'
            }
        });

        var item = [count];

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

        getFile('views\\search-cv-card.hbs').then((data) => {
            let template = hbs.compile(data + '');
            let html = template({
                json: rows
            });
            item.push(html);

            getFile('views\\search-pagination-template.hbs').then((data) => {
                hbs.registerHelper('paginate', require('handlebars-paginate'));
                let template = hbs.compile(data + '');

                let pageCount = Math.ceil(count / limit);
                let withPages = pageCount == 1 ? true : false;

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
        })
    });
});

router.get('/:id', async function (req, res) {
    let id = req.params.id

    var cv = await db.CV.findOne({
        raw: true,
        nest: true,
        where: {
            id: parseInt(id)
        },
        include: {
            model: db.Student,
            as: 'student'
        }
    });

    console.log(cv);

    if (cv.hjemmeside.includes("://")) {
        console.log(cv.hjemmeside.indexOf("://") + 3)
        cv.hjemmeside = cv.hjemmeside.substring(cv.hjemmeside.indexOf("://") + 3);
        //console.log(cv.linkedIn);
    }

    if (cv.linkedIn.includes("://")) {
        console.log(cv.linkedIn.indexOf("://") + 3)
        cv.linkedIn = cv.linkedIn.substring(cv.linkedIn.indexOf("://") + 3);
        //console.log(cv.linkedIn);
    }

    if (cv.yt_link.includes("://")) {
        console.log(cv.yt_link.indexOf("://") + 3)
        cv.yt_link = cv.yt_link.substring(cv.yt_link.indexOf("://") + 3);
        //console.log(cv.linkedIn);
    }

    if (!cv.gyldig) {
        res.send('Du har ikke adgang til denne resurse.')
    } else if (!cv.offentlig) {
        if (req.user == null) {
            res.send('Du har ikke adgang til denne resurse.')
        }
    }

    var ejer = false;
    if (req.user != null) {
        var found = await findUserByEmail(req.user);
        if (found instanceof db.Student && found.id == cv.student_id) {
            ejer = true;
        }
    }

    res.render('cv', {
        json: cv,
        ejer: ejer
    });

});


module.exports = router;