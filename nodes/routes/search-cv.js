var express = require('express');
var router = express.Router();
var hbs = require('handlebars');
var fs = require('fs');
const db = require('../models');
var formidable = require("formidable");
const limit = 10;
const { Op } = require('sequelize')


router.get('/', async function (req, res, next) {

    const udd = await db.Uddannelser.findAll({
        order: [
            ['name', 'ASC']
        ]
    });

    const {
        count,
        rows
    } = await db.CV.findAndCountAll({
        limit: 10,
        raw: true,
        order: [
            ['updatedAt', 'DESC']
        ],
    });

    res.render('search_cv', {
        json: rows,
        resultater: count,
        udd: udd
    });

});

router.post('/query', function (req, res) {

    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {
        console.log(fields);
        var filter = [];
        var where = {}
        for (var key in fields) {
            const element = key + "";
            if (element.includes("udd")) {
                let obj = {
                    uddannelse: element.substring(3)
                }
                filter.push(obj);
            }
            if (filter.length != 0) {
                where = {
                    [Op.or]: filter
                }
            }
        }
        
        console.log(filter);

        const {
            count,
            rows
        } = await db.CV.findAndCountAll({
            limit: 10,
            raw: true,
            order: [
                [fields.sort, fields.order]
            ],
            where
        });

        fs.readFile('views\\cv-card-template.hbs', function(err, data) {
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

router.get('/:id/Create_pdf', function (req, res, next) {
    let id = req.params.id

    // https://pdfkit.org/docs/guide.pdf
    // http://pdfkit.org/
  var pdf = require('pdfkit');
  var fs = require('fs');
  
  var myDoc = new pdf;
  var pdfStream = fs.createWriteStream('PDF/Test.pdf')
  myDoc.pipe(pdfStream);
  console.log(id);
  // var design = require('../Scripts/design_af_CV');
  db.CV.findOne({
    raw: true,
    where: {
        id: parseInt(id)
    }
}).then((cv) => {
    myDoc.image('public/images/facebook-default-no-profile-pic.jpg', 40, 40, {width: 150, height: 150})
  
    myDoc.font('Times-Roman')
        .fontSize(24)
        .text('Navn Navnesen',220,50)
    
    myDoc.font('Times-Roman')
        .fontSize(10.72)
        .text(cv.email,220,90)

    myDoc.font('Times-Roman')
        .fontSize(10.72)
        .text(cv.telefon,220,120)

    myDoc.font('Times-Roman')
        .fontSize(10.72)
        .text(cv.hjemmeside,220,150)

    myDoc.font('Times-Roman')
        .fontSize(10.72)
        .text(cv.linkedIn,220,180)

    myDoc.moveTo(0,210)
        .lineTo(612,210)
        .stroke()

    // myDoc.font('Times-Roman')
    //     .fontSize(10.72)
    //     .text(cv.om_mig,220,180)
    myDoc.end()
});
    pdfStream.addListener('finish', function() {
      res.setHeader('content-type', 'application/pdf'),
      res.download('PDF/Test.pdf', 'Testpdf.pdf')
    });
  
    async function deleteFile() {
  try {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(
      fs.unlinkSync('PDF/Test.pdf', (err) => {
        if (err) {
          console.error(err)
          return
        }
      })), 1000)
    });
    await promise;
  } catch (error) {
    console.log(error)
  }}
  
    deleteFile();
  });


module.exports = router;