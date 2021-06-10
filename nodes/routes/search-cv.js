var express = require('express');
var router = express.Router();
var hbs = require('handlebars');
var fs = require('fs');
const models = require('../models');
var formidable = require("formidable");
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var {
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

async function fetchData(page, parameters, req, res) {
    let offset;
    if (!page) {
        page = 1
        offset = 0;
    } else {
        offset = (page - 1) * limit;
    }

    let order;
    if (!parameters.order) {
        order = "DESC"
    } else {
        order = parameters.order
    }

    let id = {
        [Op.or]: []
    };
    let fk_education = {
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

    let availability = req.user ? 1 : 2

    let where = {
        id,
        fk_education,
        sprog,
        geo_lat,
        geo_lon,
        availability: {
            [Op.gte]: availability
        },
        gyldig: true
    };

    for (let key in parameters) {
        if (key.includes("udd")) {
            let values = parameters[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    fk_education[Op.or].push(+element);
                });
            } else {
                fk_education[Op.or].push(+values);
            }
        }

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
        if (key.includes("cvtype")) {
            let values = parameters[key];
            const CVsWithType = await models.CV_CVtype.findAll({
                where: {
                    cvtype_id: values
                },
                raw: true
            })
            CVsWithType.forEach(element => {
                id[Op.or].push(element.cv_id);
            })
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
        let speciale = {
            [Op.or]: []
        };
        let om_mig = {
            [Op.or]: []
        };
        let it_kompetencer = {
            [Op.or]: []
        };
        let udenlandsophold_og_frivilligt_arbejde = {
            [Op.or]: []
        };
        let erhvervserfaring = {
            [Op.or]: []
        };
        let tidligere_uddannelse = {
            [Op.or]: []
        };
        let fritidsinteresser = {
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
            speciale[Op.or].push({
                [Op.like]: element
            });
            om_mig[Op.or].push({
                [Op.like]: element
            });
            it_kompetencer[Op.or].push({
                [Op.like]: element
            });
            udenlandsophold_og_frivilligt_arbejde[Op.or].push({
                [Op.like]: element
            });
            erhvervserfaring[Op.or].push({
                [Op.like]: element
            });
            tidligere_uddannelse[Op.or].push({
                [Op.like]: element
            });
            fritidsinteresser[Op.or].push({
                [Op.like]: element
            });
        }

        where[Op.or] = [
            {overskrift},
            {email},
            {speciale},
            {om_mig},
            {it_kompetencer},
            {udenlandsophold_og_frivilligt_arbejde},
            {erhvervserfaring},
            {tidligere_uddannelse},
            {fritidsinteresser}
        ]
    }
    ;

    let rows = await models.CV.findAll({
        limit: limit,
        raw: false,
        nest: true,
        offset: offset,
        order: [
            ['updatedAt', order]
        ],
        include: [
            {
                model: models.Student,
                as: 'student'
            },
            {
                model: models.Uddannelse,
                as: 'education',
                attributes: ['name']
            },
            {
                model: models.CVtype,
                as: 'cvtype',
                attributes: ['cvtype'],
                through: models.CV_CVtype
            }
        ],
        where
    });

    rows = rows.map(cv => {
        let formatDate = new Date(cv.updatedAt);
        let leadingZeroDay = formatDate.getDate() < 10 ? '0' : '';
        let leadingZeroMonth = (formatDate.getMonth() + 1) < 10 ? '0' : '';

        let updatedAt = leadingZeroDay + formatDate.getDate() + "/" + leadingZeroMonth + (formatDate.getMonth() + 1) + "/" + formatDate.getFullYear();

        return {
            id: cv.id,
            overskrift: cv.overskrift,
            om_mig: cv.om_mig,
            student: {
                fornavn: cv.student.fornavn,
                efternavn: cv.student.efternavn,
                profilbillede: cv.student.profilbillede
            },
            education: {
                name: cv.education.name
            },
            cvtype: cv.cvtype.map(cvtype => {
                return {
                    cvtype: cvtype.dataValues.cvtype
                }
            }),
            formattedDate: updatedAt
        }
    });

    let favouriteCVs = [];
    if (res.locals.user instanceof models.Virksomhed) {
        favouriteCVs = await models.FavouriteCV.findAll({
            raw: true,
            where: {
                company_id: res.locals.user.id
            }
        })
    }

    rows.forEach(cv => {
        favouriteCVs.forEach(favouriteCV => {
            if (favouriteCV.cv_id === cv.id) {
                cv['isFavourite'] = true;
            }
        });
    });

    let count = await models.CV.count({
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

        if (req.query.udd !== null) {
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

        categories.push(
            {
                id: category.id,
                name: category.name,
                uddannelser: uddannelser,
                showCategory: showCategory
            }
        );
    }

    let cvtype = await models.CVtype.findAll({
        attributes: ['id', 'cvType'],
        order: [
            ['cvType', 'ASC']
        ],
    });

    let data = await fetchData(req.query.page, req.query, req, res);

    let count = data.count;
    let page = data.page;
    let pageCount = data.pageCount;
    let rows = data.rows;

    let withPages = pageCount > 1 ? true : false;

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('search_cv', {
        language: reqLang(req, res),
        json: rows,
        resultater: count,
        categories: categories,
        cvtype: cvtype,
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
        makeArray(fields, 'cvtype');

        let fetchedData = await fetchData(parseInt(fields.page), fields, req, res);

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


        // path.normalize gør path'en cross-platform.

        // På windows.
        // 'views\\partials\\search-cv-card.hbs'
        // 'views\\partials\\search-pagination.hbs'

        getFile(path.normalize('views/partials/search-cv-card.hbs')).then((data) => {
            let template = hbs.compile(data + '');
            let html = template({
                json: rows
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

    var cv = await models.CV.findOne({
        raw: true,
        nest: true,
        where: {
            id: parseInt(id)
        },
        include: [{
            model: models.Student,
            as: 'student'
        },
            {
                model: models.Uddannelse,
                as: 'education'
            }
        ]
    });

    if (cv.hjemmeside.includes("://")) {
        cv.hjemmeside = cv.hjemmeside.substring(cv.hjemmeside.indexOf("://") + 3);
    }

    if (cv.linkedIn.includes("://")) {
        cv.linkedIn = cv.linkedIn.substring(cv.linkedIn.indexOf("://") + 3);
    }

    if (cv.yt_link.includes("://")) {
        cv.yt_link = cv.yt_link.substring(cv.yt_link.indexOf("://") + 3);
    }

    var ejer = false;
    if (req.user != null) {
        var found = res.locals.user;
        if (found instanceof models.Student && found.id == cv.student_id) {
            ejer = true;
        }
    }

    if (!cv.gyldig) {
        if (!ejer) {
            return res.status(403).render('error403', {
                layout: false
            });
        }
    } else if (cv.availability == 0) {
        if (!ejer) {
            return res.status(403).render('error403', {
                layout: false
            });
        }
    } else {
        if (!req.user && cv.availability == 1) {
            return res.status(403).render('error403', {
                layout: false
            });
        }
    }

    res.render('cv-view', {
        language: reqLang(req, res),
        json: cv,
        ejer: ejer
    });

});

router.get('/:id/create_pdf', function (req, res, next) {
    let id = req.params.id

    var pdf = require('pdfkit'); // bruger pdfkit til at lave gennerer vores pdf
    var fs = require('fs');

    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var myDoc = new pdf({
        bufferPages: true,
        size: 'A4'
    });
    var cvOutside;
    let uniqueId = uuidv4();
    console.log(uniqueId)
    var pdfStream = fs.createWriteStream('public/pdf/' + uniqueId + '.pdf', {
        encoding: 'utf8'
    });
    myDoc.pipe(pdfStream);
    models.CV.findOne({
        raw: true,
        nest: true,
        where: {
            id: parseInt(id)
        },
        include: [{
            model: models.Student,
            as: 'student'
        },
            {
                model: models.Uddannelse,
                as: 'education'
            }
        ],
    }).then((cv) => {
        cvOutside = cv;
        for (const key in cv) {
            if (Object.hasOwnProperty.call(cv, key)) {
                const element = cv[key];

                if (typeof element === 'string') {
                    cv[key] = element.replace(/(\r\n|\n|\r)/gm, "\n");
                }
            }
        }

        let picPath;
        if (cv.student.profilbillede != null) {
            picPath = uploadFolder + cv.student.profilbillede;
        } else {
            picPath = 'public/images/dummy-profile-pic.jpg';
        }


        // Håndtere oversættelse
        let lang = reqLang(req, res);
        let texts;
        if (lang == 'en') {
            texts = {
                dato_downloadet: "Date downloaded: ",
                telefon: "Phone:",
                by: "City:",
                hjemmeside: "Website:",
                overskrift: "Headline",
                om_mig: "About me",
                erhvervserfaring: "Work experience",
                uddannelse: "Education",
                speciale: "Speciality",
                tidligere_uddannelse: "Past education",
                udlandsophold_og_frivilligt_arbejde: "Study abroad and volunteer work",
                fritidsinteresser: "Hobbies",
                it_kompetencer: "IT skills",
                sprog: "Language",
                ikke_angivet: "Not specified",
                side: "Page ",
                af: " of "
            }
        } else {
            texts = {
                dato_downloadet: "Dato downloadet: ",
                telefon: "Telefon:",
                by: "By:",
                hjemmeside: "Hjemmeside:",
                overskrift: "Overskrift",
                om_mig: "Om mig",
                erhvervserfaring: "Erhvervserfaring",
                uddannelse: "Uddannelse",
                speciale: "Speciale",
                tidligere_uddannelse: "Tidligere uddannelse",
                udlandsophold_og_frivilligt_arbejde: "Udlandsophold og frivilligt arbejde",
                fritidsinteresser: "Fritidsinteresser",
                it_kompetencer: "It-kompetencer",
                sprog: "Sprog",
                ikke_angivet: "Ikke angivet",
                side: "Side ",
                af: " af "
            }
        }

        // Før linie
        myDoc.font(path.normalize('fonts/arial.ttf'));

        myDoc.fillColor('black')
            .fontSize(10)
            .text(texts.dato_downloadet + date, 12, 12);

        myDoc.image(picPath, 40, 40, {
            width: 150,
            height: 150
        });

        myDoc.fontSize(24)
            .lineGap(16)
            .text(cv.student.fornavn + " " + cv.student.efternavn, 220, 40);

        myDoc.fontSize(11)
            .lineGap(16.5)
            .text('Email:')
            .moveUp()
            .text(cv.email, 300);

        myDoc.text(texts.telefon, 220)
            .moveUp()
            .text(cv.telefon, 300);

        let city = cv.postcode != null && cv.postcode != '' ? cv.postcode + " " + cv.city : texts.ikke_angivet;
        myDoc.text(texts.by, 220)
            .moveUp()
            .text(city, 300);

        let hjemmeside = cv.hjemmeside != null && cv.hjemmeside != '' ? cv.hjemmeside : texts.ikke_angivet;
        myDoc.text(texts.hjemmeside, 220)
            .moveUp()
            .text(hjemmeside, 300);

        let linkedIn = cv.linkedIn != null && cv.linkedIn != '' ? cv.linkedIn : texts.ikke_angivet;
        myDoc.text('LinkedIn:', 220)
            .moveUp()
            .text(linkedIn, 300);

        if (cv.yt_link != null && cv.yt_link != '') {
            myDoc.text('Youtube CV:', 220)
                .moveUp()
                .fillColor('blue')
                .lineGap(32)
                .text('link', 300, null, {
                    link: cv.yt_link
                });
        } else {
            myDoc.text('Youtube CV:', 220)
                .moveUp()
                .lineGap(32)
                .text(texts.ikke_angivet, 300);
        }

        myDoc.fillColor('black')
        myDoc.moveTo(8, myDoc.y);

        let a4Width = 595.28;
        myDoc.lineTo(a4Width - 8, myDoc.y)
            .stroke()

        // Efter linie

        myDoc.lineGap(8)
        myDoc.moveDown();

        // Overskrift
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.overskrift, 50);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(cv.overskrift);

        myDoc.moveDown(2);


        // Om mig
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.om_mig, 50);

        let om_mig = cv.erhvervserfaring ? cv.erhvervserfaring : texts.ikke_angivet
        myDoc.fontSize(10)
            .lineGap(2)
            .text(om_mig);

        myDoc.moveDown(2);

        // Erhvervserfaring
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.erhvervserfaring);

        let erhvervserfaring = cv.erhvervserfaring != null && cv.erhvervserfaring != '' ? cv.erhvervserfaring : texts.ikke_angivet
        myDoc.fontSize(10)
            .lineGap(2)
            .text(erhvervserfaring);

        myDoc.moveDown(2);

        // Uddannelse
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.uddannelse);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(cv.education.name);

        myDoc.moveDown(2);

        // Speciale
        let speciale = cv.speciale != null && cv.speciale != '' ? cv.speciale : texts.ikke_angivet
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.speciale);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(speciale);

        myDoc.moveDown(2);

        // Udlandsophold og frivillig arbejde
        let udenlandsophold_og_frivilligt_arbejde = cv.udenlandsophold_og_frivilligt_arbejde != null
        && cv.udenlandsophold_og_frivilligt_arbejde != '' ? cv.udenlandsophold_og_frivilligt_arbejde : texts.ikke_angivet
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.udlandsophold_og_frivilligt_arbejde);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(udenlandsophold_og_frivilligt_arbejde);

        myDoc.moveDown(2);


        // Fritidsinteresser
        let fritidsinteresser = cv.fritidsinteresser != null && cv.fritidsinteresser != '' ? cv.fritidsinteresser : texts.ikke_angivet
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.fritidsinteresser);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(fritidsinteresser);

        myDoc.moveDown(2);


        // It-kompetencer
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.it_kompetencer);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(cv.it_kompetencer);

        myDoc.moveDown(2);


        // Sprog
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.sprog);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(cv.sprog);


        let a4Height = 841.89;
        const range = myDoc.bufferedPageRange();
        for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
            myDoc.switchToPage(i);
            myDoc.text(texts.side + `${i + 1}` + texts.af + `${range.count}`, a4Width - 64, a4Height - 32);
        }

        myDoc.end();
    });
    pdfStream.addListener('finish', function () {
        res.setHeader('content-type', 'application/pdf'),
            res.download('public/pdf/' + uniqueId + '.pdf', cvOutside.student.fornavn + '_' + cvOutside.student.efternavn + '.pdf')
    });

    async function deleteFile() {
        try {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve(
                    fs.unlinkSync('public/pdf/' + uniqueId + '.pdf', (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    })), 1000)
            });
            await promise;
        } catch (error) {
            console.log(error)
        }
    }

    deleteFile();
});


module.exports = router;