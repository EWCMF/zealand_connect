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

    let order;
    if (!parameters.order) {
        order = "DESC"
    } else {
        order = parameters.order
    }

    let id = {
        [Op.or]: []
    };
    let sprog = {
        [Op.or]: []
    };
    let postcode = {
        [Op.or]: []
    };

    let campus_id = {
        [Op.or]: []
    }

    let where = {
        id,
        sprog,
        campus_id,
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

        if (key.includes('loc')) {
            let values = parameters[key];
            if (Array.isArray(values)) {
                values.forEach(element => {
                    campus_id[Op.or].push(+element);
                });
            } else {
                campus_id[Op.or].push(+values);
            }
        }
    }

    if (parameters.hasOwnProperty('search')) {
        let overskrift = {
            [Op.or]: []
        };
        let email = {
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

        where[Op.or] = [{
                overskrift
            },
            {
                email
            },
            {
                it_kompetencer
            },
            {
                erhvervserfaring
            },
            {
                tidligere_uddannelse
            },
            {
                tidligere_projekter
            },
            {
                interesser
            }
        ]
    };

    let rows = await models.ProfessorCV.findAll({
        limit: limit,
        raw: false,
        nest: true,
        offset: offset,
        order: [
            ['updatedAt', order]
        ],
        include: [{
                model: models.Professor,
                as: 'professor'
            },
            {
                model: models.Uddannelse,
                attributes: ['name'],
                through: models.ProfessorCV_Education,
            },
            {
                model: models.ProfessorPosition,
                attributes: ['name'],
                as: 'position'
            },
            {
                model: models.ProfessorCampus,
                attributes: ['name'],
                as: 'campus'
            }
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

    let campuses = await models.ProfessorCampus.findAll({
        raw: true,
        order: [
            ['name', 'ASC']
        ]
    })

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
        campuses: campuses,
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
        makeArray(fields, 'loc');

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
            },
            {
                model: models.ProfessorPosition,
                attributes: ['name'],
                as: 'position'
            },
            {
                model: models.ProfessorCampus,
                attributes: ['name'],
                as: 'campus'
            }
        ],
        order: [
            [{
                model: models.Uddannelse
            }, 'name', 'ASC']
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

    res.render('professor-cv-view', {
        language: reqLang(req, res),
        json: cv,
        educations: cv.Uddannelses,
        ejer: ejer
    });

});

router.get('/:id/create_pdf', function (req, res, next) {
    let id = req.params.id

    const pdf = require('pdfkit'); // bruger pdfkit til at lave gennerer vores pdf
    const fs = require('fs');

    const today = new Date();
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    let myDoc = new pdf({
        bufferPages: true,
        size: 'A4'
    });
    let cvOutside;
    const pdfStream = fs.createWriteStream('public/pdf/temp.pdf', {
        encoding: 'utf8'
    });
    myDoc.pipe(pdfStream);
    models.ProfessorCV.findOne({
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
            },
            {
                model: models.ProfessorPosition,
                attributes: ['name'],
                as: 'position'
            },
            {
                model: models.ProfessorCampus,
                attributes: ['name'],
                as: 'campus'
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
        if (cv.professor.profilbillede != null) {
            picPath = uploadFolder + cv.professor.profilbillede;
        } else {
            picPath = 'public/images/dummy-profile-pic.jpg';
        }

        // Håndter oversættelse
        let lang = reqLang(req, res);
        let texts;
        if (lang == 'en') {
            texts = {
                dato_downloadet: "Date downloaded: ",
                telefon: "Phone:",
                website: "Website:",
                campus: "Campus:",
                by: "City:",
                position: "Position:",
                uddannelser: "Educations:",
                teaches: "Teaches:",
                overskrift: "CV (Curriculum Vitae)",
                about: "Short presentation",
                erhvervserfaring: "Work experience",
                uddannelse: "Education",
                tidligere_uddannelse: "Past education",
                projekter: "Past projects",
                interesser: "Hobbies",
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
                website: "Hjemmeside:",
                campus: "Afdeling:",
                arbejdssted: "Arbejdssted:",
                by: "By:",
                position: "Stilling: ",
                uddannelser: "Uddannelser: ",
                teaches: "Underviser i:",
                overskrift: "CV (Curriculum Vitae)",
                about: "Kort præsentation",
                erhvervserfaring: "Erhvervserfaring",
                uddannelse: "Uddannelse",
                tidligere_uddannelse: "Tidligere uddannelse",
                projekter: "Tidligere projekter",
                interesser: "Interesser",
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
            .text(cv.professor.fornavn + " " + cv.professor.efternavn, 220, 40);

        myDoc.fontSize(11)
            .lineGap(16.5)
            .text('Email:')
            .moveUp()
            .text(cv.email, 300);

        myDoc.text(texts.telefon, 220)
            .moveUp()
            .text(cv.telefon, 300);

        let campus = cv.campus != null && cv.campus != '' ? cv.campus.name : texts.ikke_angivet;
        myDoc.text(texts.campus, 220)
            .moveUp()
            .text(campus, 300);

        let position = cv.position != null && cv.position != '' ? cv.position.name : texts.ikke_angivet;
        myDoc.text(texts.position, 220)
            .moveUp()
            .text(position, 300);

        // Tilknyttede uddannelser
        myDoc.text(texts.uddannelser, 220)
            .moveUp()

        let eduText = "";
        for (let i = 0; i < cv.Uddannelses.length; i++) {
            let education = cv.Uddannelses[i].name
            eduText += education;
            if (i < cv.Uddannelses.length - 1) {
                eduText += ", "
            }
        }
        myDoc.text(eduText, 300)

        let teaches = cv.teaches != null && cv.teaches != '' ? cv.teaches : texts.ikke_angivet;
        myDoc.text(texts.teaches, 220)
            .moveUp()
            .text(teaches, 300);

        let website = cv.website != null && cv.website != '' ? cv.website : texts.ikke_angivet;
        myDoc.text(texts.website, 220)
            .moveUp()
            .text(website, 300);

        let linkedIn = cv.linkedIn != null && cv.linkedIn != '' ? cv.linkedIn : texts.ikke_angivet;
        myDoc.text('LinkedIn:', 220)
            .moveUp()
            .text(linkedIn, 300);

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
            .text(texts.about, 50);

        let about = cv.about ? cv.about : texts.ikke_angivet
        myDoc.fontSize(10)
            .lineGap(2)
            .text(about);

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

        // Tidligere uddannelse
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.tidligere_uddannelse);

        let tidligere_uddannelse = cv.tidligere_uddannelse != null && cv.tidligere_uddannelse != '' ? cv.tidligere_uddannelse : texts.ikke_angivet
        myDoc.fontSize(10)
            .lineGap(2)
            .text(tidligere_uddannelse);

        myDoc.moveDown(2);

        // Tidligere uddannelse
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.projekter);

        let projekter = cv.tidligere_projekter != null && cv.tidligere_projekter != '' ? cv.tidligere_projekter : texts.ikke_angivet
        myDoc.fontSize(10)
            .lineGap(2)
            .text(projekter);

        myDoc.moveDown(2);

        // Interesser
        let interesser = cv.interesser != null && cv.interesser != '' ? cv.interesser : texts.ikke_angivet
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.interesser);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(interesser);

        myDoc.moveDown(2);

        // Sprog
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.sprog);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(cv.sprog);

        myDoc.moveDown(2);

        // It-kompetencer
        myDoc.fontSize(16)
            .lineGap(16)
            .text(texts.it_kompetencer);

        myDoc.fontSize(10)
            .lineGap(2)
            .text(cv.it_kompetencer);

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
            res.download('public/pdf/temp.pdf', cvOutside.professor.fornavn + '_' + cvOutside.professor.efternavn + '.pdf')
    });

    async function deleteFile() {
        try {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve(
                    fs.unlinkSync('public/pdf/temp.pdf', (err) => {
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