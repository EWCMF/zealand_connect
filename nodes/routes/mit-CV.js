const e = require('express');
var express = require('express');
var router = express.Router();
const db = require('../models');

router.get('/', function (req, res, next) {
  res.render('Mit-CV', {
    Profil: "Hans Sørensen",
  })
});

router.get('/search', function (req, res, next) {
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

module.exports = router;

router.post('/submit', function (req, res, next) {

  let overskrift = req.body.overskrift;
  let uddannelse = req.body.uddannelse;
  let email = req.body.email;
  let sprog = req.body.sprog;
  let speciale = req.body.speciale;
  let telefon = req.body.telefon;
  let linkedIn = req.body.linkedIn;
  let om_mig = req.body.om;
  let it_kompetencer = req.body.iT_Kompetencer;
  let udenlandsophold_og_frivilligt_arbejde = req.body.UogFA;
  let erhvervserfaring = req.body.erhvervserfaring;
  let tidligere_uddannelse = req.body.tidligere_uddannelse;
  let hjemmeside = req.body.hjemmeside;
  let fritidsinteresser = req.body.fritidsinteresser;
  let offentligCheckbox = req.body.offentligCheckBox;

  var offentlig;
  if (offentligCheckbox == "on") {
    offentlig = true;
  } else {
    offentlig = false;
  }

  var json = {
    overskrift,
    uddannelse,
    email,
    sprog,
    speciale,
    telefon,
    linkedIn,
    om_mig,
    it_kompetencer,
    udenlandsophold_og_frivilligt_arbejde,
    erhvervserfaring,
    tidligere_uddannelse,
    hjemmeside,
    fritidsinteresser,
    offentlig
  }
  res.send(JSON.stringify(json));
  db.CV.create(json).then((cv) => {
    console.log(cv);
  }).catch((error) => {
    console.log(error)
  });
});