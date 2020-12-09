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

    const udd = await db.Uddannelser.findAll({
        order: [
            ['name', 'ASC']
        ]
    });
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
        ]

       ,where: { [Op.or]:[{'expired': {[Op.ne]: 1}},
           {[ Op.and]:[{'expired': 1}, { 'post_end_date':{[Op.gt]:year+"-"+month+"-"+day}}]}
       ]
       }
       
    });
    console.log(day+month+ year)
    let pageCount = Math.ceil(count / limit);
    let withPages = pageCount > 1  ? true : false;

    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        element['post_start_date'] = element['post_start_date'].substring(0, 10);
        element['post_end_date'] = element['post_end_date'].substring(0, 10);

    }

    res.render('search_praktik', {
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

        // var expired = {
        //     [Op.or]: [
        //         {'expired': {[Op.ne]: 1}},
        //         {[ Op.and]:[
        //            {'expired': 1}, 
        //            { 'post_end_date': {[Op.gt]:year+"-"+month+"-"+day}}
        //         ]}
        //     ]
        // };

        var expired = {
            expired: {[Op.ne]: 1}
        }

        for (var key in fields) {
            const element = key + "";
            if (element.includes("udd")) {

                // education[Op.or].push(element.substring(3));
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
                let reg = parseInt(element.substring(3, 4));
                console.log(reg);
                region[Op.or].push(
                    reg
                );
            }

            if (fields.pos != '') {
                let code = parseInt(fields.pos); 
                console.log(code);
                postcode[Op.or].push(
                    code
                );
            }
        }

        where = {
            education,
            country,
            region,
            postcode,
            expired
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
            where
        });

        var item = [count];

        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            element['post_start_date'] = element['post_start_date'].substring(0, 10);
            element['post_end_date'] = element['post_end_date'].substring(0, 10);        
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