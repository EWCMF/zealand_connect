const express = require('express');
const router = express.Router();
const hbs = require('handlebars');
const fs = require('fs');
const models = require('../models');
const formidable = require("formidable");
const fetch = require('node-fetch');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const {
    reqLang
} = require('../public/javascript/request');
const path = require('path');
const limit = 10;
const {
    Op
} = require('sequelize');
const uploadFolder = require('../constants/references').uploadFolder();
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
    let sprog = {
        [Op.or]: []
    };
    let geo_lat = {
        [Op.or]: []
    };
    let geo_lon = {
        [Op.or]: []
    };

    let where = {
        id,
        sprog,
        geo_lat,
        geo_lon,
        offentlig: true
    };

    for (let key in parameters) {
        if (key.includes("lnd")) {
            let values = parameters[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    if (element.includes('ind')) {
                        sprog[Op.or].push({
                            [Op.like]: '%dansk%'
                        });
                        sprog[Op.or].push({
                            [Op.like]: '%Dansk%'
                        });
                    }
                    if (element.includes('ud')) {
                        sprog[Op.or].push({
                            [Op.notLike]: '%dansk%'
                        });

                        sprog[Op.or].push({
                            [Op.notLike]: '%Dansk%'
                        });
                    }
                });
            } else {
                if (values.includes('ind')) {
                    sprog[Op.or].push({
                        [Op.like]: '%dansk%'
                    });
                    sprog[Op.or].push({
                        [Op.like]: '%Dansk%'
                    });
                }
                if (values.includes('ud')) {
                    sprog[Op.or].push({
                        [Op.notLike]: '%dansk%'
                    });

                    sprog[Op.or].push({
                        [Op.notLike]: '%Dansk%'
                    });
                }
            }
        }

        if (key.includes("udd")) {
            let values = parameters[key];
            const CVEducations = await models.ProfessorCV_Education.findAll({
                where: {
                    education_id: values
                },
                raw: true
            });

            if (CVEducations.length != 0) {
                CVEducations.forEach(element => {
                    id[Op.or].push(element.cv_id);
                });
            } else {
                id[Op.or].push(-1);
            }
        }
    }

    if (parameters.hasOwnProperty('geo_id') && parameters.hasOwnProperty('geo_radius')) {
        let geo_id = parameters['geo_id'];
        let geo_radius = parameters['geo_radius'];

        const url = 'https://dawa.aws.dk/adresser?id=' + geo_id + "&format=geojson";
        const res = await fetch(url);
        const data = await res.json();//assuming data is json
        if (data.type.includes('FeatureCollection')) {
            let json = data;

            let longitude = +json.features[0].geometry.coordinates[0];
            let latitude = +json.features[0].geometry.coordinates[1];
            let radius = +geo_radius * 1000;

            let R = 6371e3; // earth's mean radius in metres
            let cos = Math.cos
            let π = Math.PI;

            let params = {
                minLat: latitude - radius / R * 180 / π,
                maxLat: latitude + radius / R * 180 / π,
                minLon: longitude - radius / R * 180 / π / cos(latitude * π / 180),
                maxLon: longitude + radius / R * 180 / π / cos(latitude * π / 180)
            };

            geo_lat[Op.or] = {[Op.between]: [params.minLat, params.maxLat]};
            geo_lon[Op.or] = {[Op.between]: [params.minLon, params.maxLon]};
        }
    }

    if (parameters.hasOwnProperty('search')) {
        let overskrift = {
            [Op.or]: []
        };
        let email = {
            [Op.or]: []
        };
        let arbejdssted = {
            [Op.or]: []
        };
        let stilling = {
            [Op.or]: []
        };
        let about = {
            [Op.or]: []
        };
        let it_kompetencer = {
            [Op.or]: []
        };
        let erhvervserfaring = {
            [Op.or]: []
        };
        let tidligere_uddannelse = {
            [Op.or]: []
        };
        let tidligere_projekter = {
            [Op.or]: []
        };
        let interesser = {
            [Op.or]: []
        };

        let search = parameters['search'].split(' ');
        for (let i = 0; i < search.length; i++) {
            let element = search[i];
            element = "%" + element + "%"
            overskrift[Op.or].push({
                [Op.like]: element
            });
            email[Op.or].push({
                [Op.like]: element
            });
            arbejdssted[Op.or].push({
                [Op.like]: element
            });
            stilling[Op.or].push({
                [Op.like]: element
            });
            about[Op.or].push({
                [Op.like]: element
            });
            it_kompetencer[Op.or].push({
                [Op.like]: element
            });
            erhvervserfaring[Op.or].push({
                [Op.like]: element
            });
            tidligere_uddannelse[Op.or].push({
                [Op.like]: element
            });
            tidligere_projekter[Op.or].push({
                [Op.like]: element
            });
            interesser[Op.or].push({
                [Op.like]: element
            });
        }

        where[Op.or] = [
            {overskrift},
            {email},
            {arbejdssted},
            {stilling},
            {it_kompetencer},
            {erhvervserfaring},
            {tidligere_uddannelse},
            {tidligere_projekter},
            {interesser}
        ]
    }
    ;

    let rows = await models.ProfessorCV.findAll({
        limit: limit,
        raw: false,
        nest: true,
        offset: offset,
        order: [
            ['updatedAt', 'DESC']
        ],
        include: [
            {
                model: models.Professor,
                as: 'professor'
            },
            {
                model: models.Uddannelse,
                attributes: ['name'],
                through: models.ProfessorCV_Education,
            },
        ],
        where
    });

    let count = await models.ProfessorCV.count({
        where
    });

    let pageCount = Math.ceil(count / limit);

    return {
        count: count,
        page: page,
        pageCount: pageCount,
        rows: rows
    };
}

router.get('/', async function (req, res, next) {
    let categoryQuery = await models.EducationCategory.findAll({
        raw: true,
        attributes: ['id', 'name'],
        order: [
            ['name', 'ASC']
        ]
    });

    let categories = []
    for (const category of categoryQuery) {
        const uddannelser = await models.Uddannelse.findAll({
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

    let data = await fetchData(req.query.page, req.query, res);

    let count = data.count;
    let page = data.page;
    let pageCount = data.pageCount;
    let rows = data.rows;

    let withPages = pageCount > 1 ? true : false;

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('search-professor-cv', {
        language: reqLang(req, res),
        categories: categories,
        json: rows,
        resultater: count,
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
        makeArray(fields, 'udd');
        makeArray(fields, 'lnd');
        makeArray(fields, 'geo');

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

        getFile(path.normalize('views/partials/search-professor-cv-card.hbs')).then((data) => {
            let template = hbs.compile(data + '');
            let html = template({
                json: rows,
            }, {
                allowProtoPropertiesByDefault: true
            });
            item.push(html);

            getFile(path.normalize('views/partials/search-pagination.hbs')).then((data) => {
                hbs.registerHelper('paginate', require('handlebars-paginate'));
                let template = hbs.compile(data + '');

                let withPages = pageCount > 1 ? true : false;

                let html = template(
                    {
                        pagination: {
                            page: page,
                            pageCount: pageCount
                        },
                        withPages
                    }
                );

                item.push(html);
                res.send(item);
            });
        })
    });
});

router.get('/:id', async function (req, res) {
    let id = req.params.id

    let cv = await models.ProfessorCV.findOne({
        nest: true,
        where: {
            id: parseInt(id)
        },
        include: [{
            model: models.Professor,
            as: 'professor'
        },
        {
            model: models.Uddannelse,
            attributes: ['name'],
            through: models.ProfessorCV_Education
        }],
        order: [
            [{model: models.Uddannelse}, 'name', 'ASC']
        ]
    });

    if (cv.linkedIn) {
        if (cv.linkedIn.includes("://")) {
            cv.linkedIn = cv.linkedIn.substring(cv.linkedIn.indexOf("://") + 3);
        }
    }

    let ejer = false;
    if (req.user != null) {
        let found = res.locals.user;
        if (found instanceof models.Professor && found.id === cv.professor_id) {
            ejer = true;
        }
    }

    if (!cv.offentlig) {
        if (req.user == null) {
            res.status(403).render('error403', {
                layout: false
            });
        }
    }

    console.log(cv);

    res.render('professor-cv-view', {
        language: reqLang(req, res),
        json: cv,
        educations: cv.Uddannelses,
        ejer: ejer
    });

});

module.exports = router;