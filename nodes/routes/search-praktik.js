var express = require('express');
var router = express.Router();
var hbs = require('handlebars');
var fs = require('fs');
const db = require('../models');
var formidable = require("formidable");
var {
    reqLang
} = require('../public/javascript/request');
const limit = 10;
const {
    Op
} = require('sequelize');
const path = require('path');
const makeArray = function (body, param) {
    if (body.hasOwnProperty(param)) {
        let array = body[param].split(",");
        body[param] = array;
    }
};

async function fetchData(page, parameters, res) {
    let offset;
    if (!page) {
        page = 1
        offset = 0;
    } else {
        offset = (page - 1) * limit;
    }

    let id = {
        [Op.or]: []
    };
    let country = {
        [Op.or]: []
    };
    let region = {
        [Op.or]: []
    };
    let postcode = {
        [Op.or]: []
    };
    let post_type = {
        [Op.or]: []
    };

    let date = new Date();
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getUTCFullYear();

    let where = {
        id,
        country,
        region,
        postcode,
        post_type,
        post_start_date: {
            [Op.or]: [{
                    [Op.gt]: year + "-" + month + "-" + day
                },
                ''
            ]
        },
        visible: true
    };

    for (let key in parameters) {
        if (key.includes("typ")) {
            let values = parameters[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    post_type[Op.or].push(+element);
                });
            } else {
                post_type[Op.or].push(+values);
            }
        }

        if (key.includes("udd")) {
            let values = parameters[key];
            const PostEducations = await db.InternshipPost_Education.findAll({
                where: {
                    education_id: values
                },
                raw: true
            });

            if (PostEducations.length != 0) {
                PostEducations.forEach(element => {
                    id[Op.or].push(element.post_id);
                });
            } else {
                id[Op.or].push(-1);
            }
        }

        if (key.includes("lnd")) {
            let values = parameters[key];
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
            let values = parameters[key];
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
            let values = parameters[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    postcode[Op.or].push(+element);
                });
            } else {
                postcode[Op.or].push(+values);
            }
        }
    }

    if (parameters.hasOwnProperty('search')) {
        let fk_company = {
            [Op.or]: []
        };

        let navn = {
            [Op.or]: []
        };

        let search = parameters['search'].split(' ');
        for (let i = 0; i < search.length; i++) {
            let element = search[i];
            element = "%" + element + "%"
            navn[Op.or].push({
                [Op.like]: element
            });
        };

        const virksomheder = await db.Virksomhed.findAll({
            where: {
                [Op.or]: [{
                    navn
                }]
            },
            raw: true
        });
        virksomheder.forEach(element => {
            fk_company[Op.or].push(element.id);
        });

        let title = {
            [Op.or]: []
        };
        let email = {
            [Op.or]: []
        };
        let contact = {
            [Op.or]: []
        };
        let post_text = {
            [Op.or]: []
        };
        let company_link = {
            [Op.or]: []
        };

        for (let i = 0; i < search.length; i++) {
            let element = search[i];
            element = "%" + element + "%"
            title[Op.or].push({
                [Op.like]: element
            });
            email[Op.or].push({
                [Op.like]: element
            });
            contact[Op.or].push({
                [Op.like]: element
            });
            post_text[Op.or].push({
                [Op.like]: element
            });
            company_link[Op.or].push({
                [Op.like]: element
            });
        };

        delete where[Op.or];
        where[Op.and] = [{
                post_start_date: {
                    [Op.or]: [{
                            [Op.gt]: year + "-" + month + "-" + day
                        },
                        ''
                    ]
                },
                visible: true
            },
            {
                [Op.or]: [{
                        fk_company
                    },
                    {
                        title
                    },
                    {
                        email
                    },
                    {
                        contact
                    },
                    {
                        post_text
                    },
                    {
                        company_link
                    }
                ]
            }
        ]
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
                model: db.Uddannelse
            }, 'name', 'ASC']
        ],
        include: [{
                model: db.Virksomhed,
                as: 'virksomhed'
            },
            {
                model: db.Uddannelse,
                attributes: ['name'],
                through: db.InternshipPost_Education,
            },
        ],
        where
    });

    let favouritePosts = [];
    if (res.locals.user instanceof db.Student) {
        favouritePosts = await db.FavouritePost.findAll({
            raw: true,
            where: {
                student_id: res.locals.user.id
            }
        });
    }

    let pageCount = Math.ceil(count / limit);

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
                element['post_type'] = 'Trainee stilling';
                break;
            case 4:
                element['post_type'] = 'Fuldtidsstilling';
        }

        favouritePosts.forEach(favouritePost => {
            if (favouritePost.internship_post_id === element.id) {
                element['isFavourite'] = true;
            }
        });
    }

    return {
        count: count,
        page: page,
        pageCount: pageCount,
        rows: rows,
        favouritePosts: favouritePosts
    };
}

router.get('/', async function (req, res, next) {
    let categoryQuery = await db.EducationCategory.findAll({
        raw: true,
        attributes: ['id', 'name'],
        order: [
            ['name', 'ASC']
        ]
    });

    let categories = []
    for (const category of categoryQuery) {
        const uddannelser = await db.Uddannelse.findAll({
            raw: true,
            where: {
                fk_education_category: category.id
            }
        });
        let showCategory = '';

        if (req.query.udd) {
            for (const uddannelse of uddannelser) {
                if (Array.isArray(req.query.udd)) {
                    for (const udd of req.query.udd) {
                        if (uddannelse.id == udd) {
                            showCategory = 'show'
                            break;
                        }
                    }
                } else {
                    if (uddannelse.id == req.query.udd) {
                        showCategory = 'show';
                    }
                }
            }
        }

        categories.push({
            id: category.id,
            name: category.name,
            uddannelser: uddannelser,
            showCategory: showCategory
        });
    }

    const user = res.locals.user

    let preconfigEducationFilter;
    if (user) {
        if (user.cv && user instanceof db.Student) {
            if (Object.keys(req.query).length === 0) {
                req.query.udd = [user.cv.fk_education];

                let categoryId;
                categories.every(category => {
                    let found = category.uddannelser.find(uddannelse => uddannelse.id == user.cv.fk_education);

                    if (found) {
                        categoryId = found.fk_education_category;
                    }

                    return !found;
                });

                preconfigEducationFilter = {
                    categoryId: categoryId,
                    id: user.cv.fk_education
                };
            };
        };
    };

    let data = await fetchData(req.query.page, req.query, res);

    let count = data.count;
    let page = data.page;
    let pageCount = data.pageCount;
    let rows = data.rows;
    let favouritePosts = data.favouritePosts

    let withPages = pageCount > 1 ? true : false;

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('search_praktik', {
        language: reqLang(req, res),
        json: rows,
        resultater: count,
        categories: categories,
        pagination: {
            page: page,
            pageCount: pageCount
        },
        withPages,
        url: fullUrl,
        preconfigEducationFilter: preconfigEducationFilter,
        favouritePosts: favouritePosts
    });

});

router.post('/query', function (req, res) {

    let formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {

        makeArray(fields, 'typ');
        makeArray(fields, 'udd');
        makeArray(fields, 'lnd');
        makeArray(fields, 'reg');
        makeArray(fields, 'pos');

        let fetchedData = await fetchData(parseInt(fields.page), fields, res);

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
                json: rows,
                isStudent: res.locals.isStudent
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
                    withPages,
                });

                item.push(html);
                res.send(item);
            });
        })
    });
});

module.exports = router;