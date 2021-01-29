var express = require('express');
var router = express.Router();
var hbs = require('handlebars');
var fs = require('fs');
const db = require('../models');
var formidable = require("formidable");
var { reqLang } = require('../public/javascript/request');
const path = require('path');
const limit = 5;
const {
    Op
} = require('sequelize');
const uploadFolder = require('../constants/references').uploadFolder();
const makeArray = function(body, param) {
    if (body.hasOwnProperty(param)) {
        let array = body[param].split(",");
        body[param] = array;
    }
};
const handleWhere = function(paramContainer) {
    let fk_education = {
        [Op.or]: []
    };
    let sprog = {
        [Op.or]: []
    };

    for (let key in paramContainer) {
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
    }

    return where = {
        fk_education,
        sprog,
        offentlig: true,
        gyldig: true
    }
}


router.get('/', async function (req, res, next) {

    let engLang = req.cookies.lang == 'en';
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

    let udd = await db.Uddannelse.findAll({
        attributes: ['id', 'name'],
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
        include: [{
            model: db.Student,
            as: 'student'
        },
        {
            model: db.Uddannelse,
            as: 'education',
            attributes: ['name']
        }],
        where
    });

    let pageCount = Math.ceil(count / limit);
    let withPages = pageCount > 1 ? true : false;

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('search_cv', {
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
        makeArray(fields, 'udd');
        makeArray(fields, 'lnd');

        let where = handleWhere(fields);

        var page = parseInt(fields.page);
        var offset;

        if (page == 1) {
            offset = 0
        } else {
            offset = (page - 1) * limit;
        };

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
            include: [{
                model: db.Student,
                as: 'student'
            },
            {
                model: db.Uddannelse,
                as: 'education',
                attributes: ['name']
            }]
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

router.get('/:id', async function (req, res) {
    let id = req.params.id

    var cv = await db.CV.findOne({
        raw: true,
        nest: true,
        where: {
            id: parseInt(id)
        },
        include: [{
            model: db.Student,
            as: 'student'
        },
        {
            model: db.Uddannelse,
            as: 'education'
        }]
    });

    if (cv.hjemmeside.includes("://")) {
        cv.hjemmeside = cv.hjemmeside.substring(cv.hjemmeside.indexOf("://") + 3);
        //console.log(cv.linkedIn);
    }

    if (cv.linkedIn.includes("://")) {
        cv.linkedIn = cv.linkedIn.substring(cv.linkedIn.indexOf("://") + 3);
        //console.log(cv.linkedIn);
    }

    if (cv.yt_link.includes("://")) {
        cv.yt_link = cv.yt_link.substring(cv.yt_link.indexOf("://") + 3);
        //console.log(cv.linkedIn);
    }

    var ejer = false;
    if (req.user != null) {
        var found = res.locals.user;
        if (found instanceof db.Student && found.id == cv.student_id) {
            ejer = true;
        }
    }

    if (!cv.gyldig) {
        if (!ejer) {
            res.status(403).render('error403', {layout: false});
        }
    } else if (!cv.offentlig) {
        if (req.user == null) {
            res.status(403).render('error403', {layout: false});
        }
    }

    res.render('cv', {
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
        bufferPages: true
    });
    var cvOutside;
    var pdfStream = fs.createWriteStream('public/PDF/temp.pdf')
    myDoc.pipe(pdfStream);
    db.CV.findOne({
        raw: true,
        nest: true,
        where: {
            id: parseInt(id)
        },
        include: [{
            model: db.Student,
            as: 'student'
        },
        {
            model: db.Uddannelse,
            as: 'education'
        }],
    }).then((cv) => {
        cvOutside = cv;
        for (const key in cv) {
            if (Object.hasOwnProperty.call(cv, key)) {
                const element = cv[key];

                if (typeof element === 'string') {
                    cv[key] = element.replace(/(\r\n|\n|\r)/gm, "\n")
                }
            }
        }

        var height = 12;
        // om mig ekstra højde
        var om_mig_characters = cv.om_mig.length;
        var ekstra_height_om_mig = 0;
        while (om_mig_characters > 100) {
            ekstra_height_om_mig = ekstra_height_om_mig + height;
            om_mig_characters = om_mig_characters - 100
        }

        // overskrift ekstra højde
        var overskrift_characters = cv.overskrift.length;
        var ekstra_height_overskrift = 0;
        while (overskrift_characters > 100) {
            ekstra_height_overskrift = ekstra_height_overskrift + height;
            overskrift_characters = overskrift_characters - 100;
        }

        // erhvervserfaring ekstra højde
        var erhvervserfaring_characters = cv.erhvervserfaring.length;
        var ekstra_height_erhvervserfaring = 0;
        while (erhvervserfaring_characters > 100) {
            ekstra_height_erhvervserfaring = ekstra_height_erhvervserfaring + height;
            erhvervserfaring_characters = erhvervserfaring_characters - 100;
        }

        // uddannelse ekstra højde mest til testing af responsiv
        var uddannelse_characters = cv.education.name.length;
        var ekstra_height_uddannelse = 0;
        while (uddannelse_characters > 100) {
            ekstra_height_uddannelse = ekstra_height_uddannelse + height;
            uddannelse_characters = uddannelse_characters - 100;
        }

        //Speciale ekstra højde
        var speciale_characters = cv.speciale.length;
        var ekstra_height_speciale = 0;
        while (speciale_characters > 100) {
            ekstra_height_speciale = ekstra_height_speciale + height;
            speciale_characters = speciale_characters - 100;
        }

        //Tidligere_uddannelse ekstra højde
        var tidligere_uddannelse_characters = cv.tidligere_uddannelse.length;
        var ekstra_height_tidligere_uddannelse = 0;
        while (tidligere_uddannelse_characters > 100) {
            ekstra_height_tidligere_uddannelse = ekstra_height_tidligere_uddannelse + height;
            tidligere_uddannelse_characters = tidligere_uddannelse_characters - 100;
        }

        //Udenlandsophold og frivilligt arbejde ekstra højde
        var udenlandsophold_og_frivilligt_arbejde_characters = cv.udenlandsophold_og_frivilligt_arbejde.length;
        var ekstra_height_udenlandsophold_og_frivilligt_arbejde = 0;
        while (udenlandsophold_og_frivilligt_arbejde_characters > 100) {
            ekstra_height_udenlandsophold_og_frivilligt_arbejde = ekstra_height_udenlandsophold_og_frivilligt_arbejde + height;
            udenlandsophold_og_frivilligt_arbejde_characters = udenlandsophold_og_frivilligt_arbejde_characters - 100;
        }

        //fritidsinteresser ekstra højde
        var fritidsinteresser_characters = cv.fritidsinteresser.length;
        var ekstra_height_fritidsinteresser = 0;
        while (fritidsinteresser_characters > 100) {
            ekstra_height_fritidsinteresser = ekstra_height_fritidsinteresser + height;
            fritidsinteresser_characters = fritidsinteresser_characters - 100;
        }

        //It-Kompetencer ekstra højde
        var it_Kompetencer_characters = cv.it_kompetencer.length;
        var ekstra_height_it_Kompetencer = 0;
        while (it_Kompetencer_characters > 100) {
            ekstra_height_it_Kompetencer = ekstra_height_it_Kompetencer + height;
            it_Kompetencer_characters = it_Kompetencer_characters - 100;
        }

        var height = 330;
        var new_page = 660;
        var page = 0;

        var path;
        if (cv.student.profilbillede != null) {
            path = uploadFolder + cv.student.profilbillede;
        } else {
            path = 'public/images/dummy-profile-pic.jpg';
        }

        myDoc.image(path, 40, 40, {width: 150, height: 150})

        myDoc.font('Times-Roman')
            .fontSize(24)
            .lineGap(2)
            .text(cv.student.fornavn + " " + cv.student.efternavn, 220, 50)

        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text('Email:', 220, 90)
            .text(cv.email, 300, 90)

        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text('Telefon:', 220, 120)
            .text(cv.telefon, 300, 120)

        let hjemmeside = cv.hjemmeside != null && cv.hjemmeside != '' ? cv.hjemmeside : "Ikke angivet";
        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text('Hjemmeside:', 220, 150)
            .text(hjemmeside, 300, 150)

        let linkedIn = cv.linkedIn != null && cv.linkedIn != '' ? cv.linkedIn : "Ikke angivet";
        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text('LinkedIn:', 220, 180)
            .text(linkedIn, 300, 180)

        if (cv.yt_link != null && cv.yt_link != '') {
            myDoc.font('Times-Roman')
                .fontSize(10.72)
                .text('youtube CV:', 220, 210)
                .fillColor('blue')
                .link(300, 210, 15, 20, cv.yt_link)
                .text('link', 300, 210);
        } else {
            myDoc.font('Times-Roman')
                .fontSize(10.72)
                .text('youtube CV:', 220, 210)
                .text('Ikke angivet', 300, 210);
        }


        myDoc.font('Times-Roman')
            .fillColor('black')
            .fontSize(10.72)
            .text('Downloadet:', 10, 210)
            .text(date, 70, 210)

        myDoc.moveTo(0, 240)
            .lineTo(612, 240)
            .stroke()

        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('Om mig', 50, 260)

        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(cv.om_mig, 50, 290)

        height = height + ekstra_height_om_mig;
        if (height + ekstra_height_overskrift > new_page) {
            page = page + 1
            height = height + ekstra_height_overskrift - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;
        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('Hvad jeg søger', 50, height)

        height = height + 30;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;
        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(cv.overskrift, 50, height)

        height = height + 60 + ekstra_height_overskrift;
        if (height + ekstra_height_erhvervserfaring > new_page) {
            page = page + 1
            height = height + ekstra_height_erhvervserfaring - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;
        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('Erfaring', 50, height)

        height = height + 30;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        let erhvervserfaring = cv.erhvervserfaring != null && cv.erhvervserfaring != '' ? cv.erhvervserfaring : "Ikke angivet"
        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(erhvervserfaring, 50, height)

        height = height + 60 + ekstra_height_erhvervserfaring;
        if (height + ekstra_height_uddannelse > new_page) {
            page = page + 1
            height = height + ekstra_height_uddannelse - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('Uddannelse', 50, height)

        height = height + 30;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(cv.education.name, 50, height)

        height = height + 60 + ekstra_height_uddannelse
        if (height + ekstra_height_speciale > new_page) {
            page = page + 1
            height = height + ekstra_height_speciale - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('Speciale', 50, height)

        height = height + 30;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        let speciale = cv.speciale != null && cv.speciale != '' ? cv.speciale : "Ikke angivet"
        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(speciale, 50, height)

        height = height + 60 + ekstra_height_speciale;
        if (height + ekstra_height_tidligere_uddannelse > new_page) {
            page = page + 1
            height = height + ekstra_height_tidligere_uddannelse - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('Tidligere uddannelse', 50, height)

        height = height + 30;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(cv.tidligere_uddannelse, 50, height)

        height = height + 60 + ekstra_height_tidligere_uddannelse;
        if (height + ekstra_height_udenlandsophold_og_frivilligt_arbejde > new_page) {
            page = page + 1
            height = height + ekstra_height_udenlandsophold_og_frivilligt_arbejde - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('Udenlandsophold og frivilligt arbejde', 50, height)

        height = height + 30;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        let udenlandsophold_og_frivilligt_arbejde = cv.udenlandsophold_og_frivilligt_arbejde != null
        && cv.udenlandsophold_og_frivilligt_arbejde != '' ? cv.udenlandsophold_og_frivilligt_arbejde : "Ikke angivet"
        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(udenlandsophold_og_frivilligt_arbejde, 50, height)

        height = height + 60 + ekstra_height_udenlandsophold_og_frivilligt_arbejde;
        if (height + ekstra_height_fritidsinteresser > new_page) {
            page = page + 1
            height = height + ekstra_height_fritidsinteresser - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('Fritidsinteresser', 50, height)

        height = height + 30;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        let fritidsinteresser = cv.fritidsinteresser != null && cv.fritidsinteresser != '' ? cv.fritidsinteresser : "Ikke angivet"
        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(fritidsinteresser, 50, height)

        height = height + 60 + ekstra_height_fritidsinteresser;
        if (height + ekstra_height_it_Kompetencer > new_page) {
            page = page + 1
            height = height + ekstra_height_it_Kompetencer - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('It-Kompetencer', 50, height)

        height = height + 30;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(cv.it_kompetencer, 50, height)

        height = height + 60 + ekstra_height_it_Kompetencer;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(16)
            .text('Sprog', 50, height)

        height = height + 30;
        if (height > new_page) {
            page = page + 1
            height = height - new_page
            myDoc.addPage().switchToPage(page)
        }
        ;

        myDoc.font('Times-Roman')
            .fontSize(10.72)
            .text(cv.sprog, 50, height)

        // see the range of buffered pages
        const range = myDoc.bufferedPageRange(); // => { start: 0, count: 2 }

        for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
            myDoc.switchToPage(i);
            myDoc.text(`Side ${i + 1} af ${range.count}`, 545, 755);
        }
        myDoc.end()
    });
    pdfStream.addListener('finish', function () {
        res.setHeader('content-type', 'application/pdf'),
            res.download('public/PDF/temp.pdf', cvOutside.student.fornavn + '_' + cvOutside.student.efternavn + '.pdf')
    });

    async function deleteFile() {
        try {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve(
                    fs.unlinkSync('public/PDF/temp.pdf', (err) => {
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