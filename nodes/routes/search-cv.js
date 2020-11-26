var express = require('express');
var router = express.Router();
var hbs = require('handlebars');
var fs = require('fs');
const db = require('../models');
var formidable = require("formidable");
const limit = 10;
const { Op } = require('sequelize')


router.get('/', async function (req, res, next) {
    
    var page;
    if (req.query.page == null) {
        page = 1
    } else {
        page = req.query.page
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
        limit: 5,
        raw: true,
        offset: page * 5,
        order: [
            ['updatedAt', 'DESC']
        ],
    });

    res.render('search_cv', {
        json: rows,
        resultater: count,
        udd: udd,
        pagination: {
            page: page,
            pageCount: Math.floor(count / 5)
        }
    });

});

router.post('/query', function (req, res) {

    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {
        console.log(fields);
    
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

        const {
            count,
            rows
        } = await db.CV.findAndCountAll({
            limit: 5,
            raw: true,
            order: [
                [fields.sort, fields.order]
            ],
            where
        });

        fs.readFile('views\\search-cv-card.hbs', function(err, data) {
            if (err) throw err;
            var template = hbs.compile(data + '');
            var html = template({json: rows});
            var item = [count, html];
            res.send(item);
        })
    });
});

router.get('/:id', function (req, res) {
    let id = req.params.id

    db.CV.findOne({
        raw: true,
        where: {
            id: parseInt(id)
        }
    }).then((cv) => {
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
            console.log(cv.yt_link.indexOf("://")  + 3)
            cv.yt_link = cv.yt_link.substring(cv.yt_link.indexOf("://")  + 3);
            //console.log(cv.linkedIn);
        }

        res.render('cv', {json: cv});
      
    });

});


module.exports = router;