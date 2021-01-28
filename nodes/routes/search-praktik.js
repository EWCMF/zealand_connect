var express = require('express');
var router = express.Router();
var hbs = require('handlebars');
var fs = require('fs');
const db = require('../models');
var formidable = require("formidable");
var { reqLang } = require('../public/javascript/request');
const limit = 5;
const edu = require('../constants/education');
const { Op } = require('sequelize');
const path = require('path');
const makeArray = function(body, param) {
    if (body.hasOwnProperty(param)) {
        let array = body[param].split(",");
        body[param] = array;
    }
};
const handleWhere = function(paramContainer) {
    var fk_education = {
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
    var post_type = {
        [Op.or]: []
    };

    for (let key in paramContainer) {
        if (key.includes("typ")) {
            let values = paramContainer[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    post_type[Op.or].push(+element);
                });
            } else {
                post_type[Op.or].push(+values);
            }
        }

        if (key.includes("udd")) {
            let values = paramContainer[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    fk_education[Op.or].push(+element);
                });
            } else {
                fk_education[Op.or].push(+values);
            }
        }

        if (key.includes("lnd")) {
            let values = paramContainer[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    if (element.includes('ind')) {
                        country[Op.or].push(
                            1
                        );
                    }
                    if (element.includes('ud')) {
                        country[Op.or].push({
                            [Op.not]: 1
                        });
                    }
                });
            } else {
                if (values.includes('ind')) {
                    country[Op.or].push(
                        1
                    );
                }
                if (values.includes('ud')) {
                    country[Op.or].push({
                        [Op.not]: 1
                    });
                }
            }
        }

        if (key.includes('reg')) {
            let values = paramContainer[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    let realName = '';
                    switch (element) {
                        case '1':
                            realName = 'Region Hovedstaden';
                            break;
                        case '2':
                            realName = 'Region Midtjylland';
                            break;
                        case '3':
                            realName = 'Region Nordjylland';
                            break;
                        case '4':
                            realName = 'Region Sjælland';
                            break;
                        case '5':
                            realName = 'Region Syddanmark';                   
                    };
                    region[Op.or].push(realName);
                });
            } else {
                let realName = '';
                switch (values) {
                    case '1':
                        realName = 'Region Hovedstaden';
                        break;
                    case '2':
                        realName = 'Region Midtjylland';
                        break;
                    case '3':
                        realName = 'Region Nordjylland';
                        break;
                    case '4':
                        realName = 'Region Sjælland';
                        break;
                    case '5':
                        realName = 'Region Syddanmark';                   
                };
                region[Op.or].push(realName);
            }
        };

        if (key.includes('pos')) {
            let values = paramContainer[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    postcode[Op.or].push(+element);
                });
            } else {
                postcode[Op.or].push(+values);
            }
        }
    }

    let date = new Date();
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getUTCFullYear();
    return where = {
        fk_education,
        country,
        region,
        postcode,
        post_type,
        [Op.or]: [
            {'expired': {[Op.ne]: 1}},
            {[ Op.and]:[
               {'expired': 1}, 
               { 'post_start_date': {[Op.gt]:year+"-"+month+"-"+day}}
            ]}
        ]
    }
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

    let where = handleWhere(req.query);

    const udd = await edu.getAllEducation(req);

    const user = res.locals.user

    if (user !== undefined) {
        if (user.cv != null) {
            for (let index = 0; index < udd.length; index++) {
                const element = udd[index].name;
                
                if (element == user.cv.education.name) {
    
                    udd[index].checked = 'checked'
                }
            }
        }
    }

    let uddInclude = edu.includeEducation(req);

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
        uddInclude
        ],
        where
        }   
    );

    let pageCount = Math.ceil(count / limit);
    let withPages = pageCount > 1  ? true : false;
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        let cropStart = element['post_start_date'].substring(0, 10);

        let startYear = cropStart.substring(0, cropStart.indexOf('-'));
        let startMonth = cropStart.substring(cropStart.indexOf('-') + 1, cropStart.lastIndexOf('-'));
        let startDay = cropStart.substring(cropStart.lastIndexOf('-') + 1);

        element['post_start_date'] = startDay + '/' + startMonth + '/' + startYear;

        if (element['post_end_date'] != null) {
            let cropEnd = element['post_end_date'].substring(0, 10);

            let endYear = cropEnd.substring(0, cropEnd.indexOf('-'));
            let endMonth = cropEnd.substring(cropEnd.indexOf('-') + 1, cropEnd.lastIndexOf('-'));
            let endDay = cropEnd.substring(cropEnd.lastIndexOf('-') + 1);
            element['post_end_date'] = endDay + '/' + endMonth + '/' + endYear;
        }

        if (req.cookies.lang == 'en') {
            switch (element['post_type']) {
                case 1:
                    element['post_type'] = 'Internship';
                    break;
                case 2:
                    element['post_type'] = 'Student job';
                    break;
                case 3:
                    element['post_type'] = 'Trainee';     
            }
        } else {
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

    }

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('search_praktik', {
        language: reqLang(req, res),
        json: rows,
        resultater: count,
        udd: udd,
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

        makeArray(fields, 'typ');
        makeArray(fields, 'udd');
        makeArray(fields, 'lnd');
        makeArray(fields, 'reg');
        makeArray(fields, 'pos');

        let where = handleWhere(fields);

        let page = parseInt(fields.page);
        let offset;
        
        if (page == 1) {
            offset = 0
        } else {
            offset = (page - 1) * limit;
        }

        let uddInclude = edu.includeEducation(req); 

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
            include: [{
                model: db.Virksomhed,
                as: 'virksomhed'
            },
            uddInclude
            ],
            where
        });

        var item = [count];

        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];

            let cropStart = element['post_start_date'].substring(0, 10);

            let startYear = cropStart.substring(0, cropStart.indexOf('-'));
            let startMonth = cropStart.substring(cropStart.indexOf('-') + 1, cropStart.lastIndexOf('-'));
            let startDay = cropStart.substring(cropStart.lastIndexOf('-') + 1);

            element['post_start_date'] = startDay + '/' + startMonth + '/' + startYear;

            if (element['post_end_date'] != null) {
                let cropEnd = element['post_end_date'].substring(0, 10);

                let endYear = cropEnd.substring(0, cropEnd.indexOf('-'));
                let endMonth = cropEnd.substring(cropEnd.indexOf('-') + 1, cropEnd.lastIndexOf('-'));
                let endDay = cropEnd.substring(cropEnd.lastIndexOf('-') + 1);
                element['post_end_date'] = endDay + '/' + endMonth + '/' + endYear;
            }

            if (req.cookies.lang == 'en') {
                switch (element['post_type']) {
                    case 1:
                        element['post_type'] = 'Internship';
                        break;
                    case 2:
                        element['post_type'] = 'Student job';
                        break;
                    case 3:
                        element['post_type'] = 'Trainee';     
                }
            } else {
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

        let card;
        let pagination;

        if (req.cookies.lang == 'en') {
            card = 'views/partials/search-praktik-card-en.hbs';
            pagination = 'views/partials/search-pagination-en.hbs';
        } else {
            card = 'views/partials/search-praktik-card.hbs';
            pagination = 'views/partials/search-pagination.hbs';
        }

        getFile(path.normalize(card)).then((data) => {
            let template = hbs.compile(data + '');
            let html = template({json: rows});
            item.push(html);

            getFile(path.normalize(pagination)).then((data) => {
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

module.exports = router;