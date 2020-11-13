var express = require('express');
var router = express.Router();
const db = require('../models');


router.get('/', function (req, res, next) {
    var query = req.query;

    var sort;
    var sortName;

    console.log(query);

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

        const {
            Op
        } = require("sequelize");
        db.CV.findAll({
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
                sort: sort
            });
        })
    } else {

        const {
            Op
        } = require("sequelize");
        db.CV.findAll({
            raw: true,
            order: [
                [sort, 'DESC']
            ]
        }).then((cvs) => {

            res.render('search_cv', {
                json: cvs,
                resultater: cvs.length,
                sortName: sortName,
                sort: sort
            });
        })

    }
});

router.get('/:id', function(req, res) {
    let id = req.params.id
     /*console.log(Min_linkedIn)
    if (Min_linkedIn == true) {
        console.log("jeg er tæt på")
        if (linkedIn.includes("https://")) {
            linkedIn = linkedIn.replace("https://", "")
            console.log(linkedIn)
        } else if (linkedIn.includes("http://")) {
            linkedIn = linkedIn.replace("http://", "")
            console.log(linkedIn)
        }
    }*/

    db.CV.findOne({raw: true, where: { id: parseInt(id) } }).then((cv) => {
        console.log(cv);
        if (cv.hjemmeside.includes("://")) {
            console.log(cv.hjemmeside.indexOf("://") + 3)
            cv.hjemmeside = cv.hjemmeside.substring(cv.hjemmeside.indexOf("://") + 3);
            console.log(cv.linkedIn);
        } 
        
        if (cv.linkedIn.includes("://")) {
            console.log(cv.linkedIn.indexOf("://")  + 3)
            cv.linkedIn = cv.linkedIn.substring(cv.linkedIn.indexOf("://")  + 3);
            console.log(cv.linkedIn);
        }


        res.render('cv', {json: cv});
    });

  });


module.exports = router;