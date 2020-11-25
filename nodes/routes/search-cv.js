var express = require('express');
var router = express.Router();
const db = require('../models');
const limit = 10;


router.get('/', function (req, res, next) {
    var query = req.query;
    var offset = 0;
    var singlePage;
    var pageJson;
    var pageItem1;
    var pageItem2;
    var pageItem3;

    if (query.page == null) {
        singlePage = 0; 
    } else {
        singlePage = parseInt(query.page);
    }

    if (singlePage == 0) {
        pageItem1 = "active";
        console.log(pageItem1);
        pageJson = {
            one: singlePage+1,
            two: singlePage+2,
            three: singlePage+3
        }
    }  
    
    if (singlePage == 1) {
        pageItem1 = "active";
        console.log(pageItem1);
        pageJson = {
            one: singlePage,
            two: singlePage+1,
            three: singlePage+2
        }
    }
    
    if (singlePage >= 2) {
        pageItem2 = "active";
        console.log(pageItem2);
        pageJson = {
            one: singlePage-1,
            two: singlePage,
            three: singlePage+1
        }
    }
    
    

    var sort;
    var sortName;

    var dtmCb = ""
    var hoeCb = ""
    var foeCb = ""
    var ihmCb = ""
    var ioeCb = ""
    var bkCb = ""
    var btCb = ""
    var insCb = ""

    console.log(query);

    if (query.page != null) {
        offset = limit * parseInt(query.page-1);
    }

    if (query.sort == null) {
        sort = "updatedAt";
        sortName = "Senest opdateret";
    } else {
        sort = query.sort
        switch (sort) {
            case "overskrift":
                sortName = "Overskrift";
                break;
            case "updatedAt":
                sortName = "Senest opdateret";
        }
    }

    var filter = JSON.parse("[]");
    if (query.uddannelse != null) {

        if (req.query.uddannelse.includes("Datamatiker")) {
            dtmCb = "checked";
        }
        if (req.query.uddannelse.includes("Handelsøkonom")) {
            hoeCb = "checked";
        }
        if (req.query.uddannelse.includes("Finansøkonom")) {
            foeCb = "checked";
        }
        if (req.query.uddannelse.includes("International Handel og Markedsføring")) {
            ihmCb = "checked";
        }
        if (req.query.uddannelse.includes("Innovation og Entrepreneurship")) {
            ioeCb = "checked";
        }
        if (req.query.uddannelse.includes("Bygningskontruktør")) {
            bkCb = "checked";
        }
        if (req.query.uddannelse.includes("Byggetekniker")) {
            btCb = "checked";
        }
        if (req.query.uddannelse.includes("Installatør, stærkstrøm")) {
            insCb = "checked";
        }

        if (Array.isArray(query.uddannelse)) {
            for (let index = 0; index < query.uddannelse.length; index++) {
                const element = "" + query.uddannelse[index];
                let obj = {
                    uddannelse: element
                };
                filter.push(obj);
            }
        } else {
            let obj = {
                uddannelse: query.uddannelse
            };
            console.log(obj);
            filter.push(obj);
        }
        console.log(filter);

        if (filter.includes("Datamatiker")) {
            dtmCb = "checked";
        }
        if (filter.includes("Handelsøkonom")) {
            hoeCb = "checked";
        }
        if (filter.includes("Finansøkonom")) {
            foeCb = "checked";
        }
        if (filter.includes("International Handel og Markedsføring")) {
            ihmCb = "checked";
        }
        if (filter.includes("Innovation og Entrepreneurship")) {
            ioeCb = "checked";
        }
        if (filter.includes("Bygningskontruktør")) {
            bkCb = "checked";
        }
        if (filter.includes("Byggetekniker")) {
            btCb = "checked";
        }
        if (filter.includes("Installatør, stærkstrøm")) {
            insCb = "checked";
        }

        const {
            Op
        } = require("sequelize");
        db.CV.findAll({
            limit: limit,
            offset: offset,
            raw: true,
            order: [
                [sort, 'DESC']
            ],
            where: {
                [Op.or]: filter
            }
        }).then((cvs) => {

            res.render('search_cv', {
                json: cvs,
                resultater: cvs.length,
                sortName: sortName,
                sort: sort,
                show: "show",
                dtmCb:dtmCb,
                hoeCb:hoeCb,
                foeCb:foeCb,
                ihmCb:ihmCb,
                ioeCb:ioeCb,
                bkCb:bkCb,
                btCb:btCb,
                insCb:insCb,
                pageJson,
                pageitm1: pageItem1,
                pageItm2: pageItem2
            });
        })
    } else {

        const {
            Op
        } = require("sequelize");
        db.CV.findAll({
            limit: limit,
            offset: offset,
            raw: true,
            order: [
                [sort, 'DESC']
            ]
        }).then((cvs) => {

            res.render('search_cv', {
                json: cvs,
                resultater: cvs.length,
                sortName: sortName,
                sort: sort,
                dtmCb:dtmCb,
                hoeCb:hoeCb,
                foeCb:foeCb,
                ihmCb:ihmCb,
                ioeCb:ioeCb,
                bkCb:bkCb,
                btCb:btCb,
                insCb:insCb,
                pageJson,
                pageitm1: pageItem1,
                pageItm2: pageItem2
            });
        })

    }
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
            console.log(cv.linkedIn.indexOf("://")  + 3)
            cv.linkedIn = cv.linkedIn.substring(cv.linkedIn.indexOf("://")  + 3);
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