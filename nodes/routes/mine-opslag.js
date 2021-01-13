var express = require('express');
var router = express.Router();
var hbs = require('handlebars');
var fs = require('fs');
const db = require('../models');
var formidable = require("formidable");
const limit = 5;
const { Op } = require('sequelize');
const path = require('path');

router.get('/', async function (req, res, next) {
    
    var page;
    var offset;
    if (req.query.page == null) {
        page = 1
        offset = 0;
    } else {
        page = req.query.page
        offset = page * limit;
    }

    const user = res.locals.user

    var date = new Date();
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getUTCFullYear();
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
        include: {
            model: db.Virksomhed,
            as: 'virksomhed'
        },
        where: {
            fk_company: user.id
        }
       
    });
    console.log(day+month+ year)
    let pageCount = Math.ceil(count / limit);
    let withPages = pageCount > 1  ? true : false;
    console.log(rows)
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        let eduName = await db.Uddannelser.findOne({
            where: {
                id: element['education']
            }
        });

        let cropStart = element['post_start_date'].substring(0, 10);
        let cropEnd = element['post_end_date'].substring(0, 10);

        let startYear = cropStart.substring(0, cropStart.indexOf('-'));
        let startMonth = cropStart.substring(cropStart.indexOf('-') + 1, cropStart.lastIndexOf('-'));
        let startDay = cropStart.substring(cropStart.lastIndexOf('-') + 1);

        let endYear = cropEnd.substring(0, cropEnd.indexOf('-'));
        let endMonth = cropEnd.substring(cropEnd.indexOf('-') + 1, cropEnd.lastIndexOf('-'));
        let endDay = cropEnd.substring(cropEnd.lastIndexOf('-') + 1);

        element['education'] = eduName.name;
        element['post_start_date'] = startDay + '/' + startMonth + '/' + startYear;
        element['post_end_date'] = endDay + '/' + endMonth + '/' + endYear;

    }

    res.render('mine-opslag', {
        json: rows,
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
        var education = {
            [Op.or]: []
        };
        var country = {
            [Op.or]: []
        };
        var region = {
            [Op.or]: []
        };
        var postcode = {
            [Op.or]: []
        };

        for (var key in fields) {
            const element = key + "";
            if (element.includes("udd")) {
                let udd = parseInt(element.substring(3))
                education[Op.or].push(udd);
            }

            if (element.includes('indland')) {

                country[Op.or].push(
                    1
                );
            }
            
            if (element.includes('udland')) {
                
                country[Op.or].push({
                    [Op.not]: 1
                });
            }
            
            if (element.includes('reg')) {
                
                region[Op.or].push(
                    element.substring(3)
                );
            }

            if (fields.pos != '') {
                let code = parseInt(fields.pos); 

                postcode[Op.or].push(
                    code
                );
            }
        }

        var date = new Date();
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getUTCFullYear();

        where = {
            education,
            country,
            region,
            postcode,
            [Op.or]: [
                {'expired': {[Op.ne]: 1}},
                {[ Op.and]:[
                   {'expired': 1}, 
                   { 'post_end_date': {[Op.gt]:year+"-"+month+"-"+day}}
                ]}
            ]
        } 

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
                [fields.sort, fields.order]
            ],
            include: {
                model: db.Virksomhed,
                as: 'virksomhed'
            },
            where
        });

        var item = [count];

        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            
            let eduName = await db.Uddannelser.findOne({
                where: {
                    id: element['education']
                }
            });
    
            let cropStart = element['post_start_date'].substring(0, 10);
            let cropEnd = element['post_end_date'].substring(0, 10);
    
            let startYear = cropStart.substring(0, cropStart.indexOf('-'));
            let startMonth = cropStart.substring(cropStart.indexOf('-') + 1, cropStart.lastIndexOf('-'));
            let startDay = cropStart.substring(cropStart.lastIndexOf('-') + 1);
    
            let endYear = cropEnd.substring(0, cropEnd.indexOf('-'));
            let endMonth = cropEnd.substring(cropEnd.indexOf('-') + 1, cropEnd.lastIndexOf('-'));
            let endDay = cropEnd.substring(cropEnd.lastIndexOf('-') + 1);
    
            element['education'] = eduName.name;
            element['post_start_date'] = startDay + '/' + startMonth + '/' + startYear;
            element['post_end_date'] = endDay + '/' + endMonth + '/' + endYear; 
        }

        fs.readFileAsync = function(filename) {
            return new Promise(function(resolve, reject) {
                fs.readFile(filename, function(err, data){
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
            let html = template({json: rows});
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
        })
    });
});

// stared chanching stuff here
module.exports = router;