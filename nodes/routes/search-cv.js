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
    /*let json = [{
      "id": "1",
      "overskrift": "hej med dig.",
      "underoverskrift": "ttt",
      "billede": "link her",
      "info": "blablablablablabla1"
    },
    {
      "id": "2",
      "overskrift": "hej med dig2.",
      "underoverskrift": "ttt2",
      "billede": "link her2",
      "info": "blablablablablabla1"
    }
  ]*/
    let id = req.params.id

    db.CV.findOne({raw: true, where: { id: parseInt(id) } }).then((cv) => {
        console.log(cv);
        res.render('cv', {json: cv});
    });

  });


module.exports = router;