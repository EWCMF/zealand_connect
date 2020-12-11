var express = require('express');
var router = express.Router();
const { reqLang } = require('../public/javascript/request');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const models = require("../models");

router.get('/', async function (req, res, next) {
  if (req.user == null || req.user === undefined) {
    return res.render('forside', {
      language: reqLang(req, res)
    });
  }

  var user = res.locals.user;

  if (user instanceof models.Student) {
    res.render('forside-student', {
      language: reqLang(req, res)
    });
  }

  if (user instanceof models.Virksomhed) {
    res.render('forside-virksomhed', {
      language: reqLang(req, res)
    });
  }
  
});
module.exports = router;
