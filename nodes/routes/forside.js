const express = require('express');
const router = express.Router();
const { reqLang } = require('../public/javascript/request');
const models = require("../models");

router.get('/', async function (req, res, next) {
  if (req.user == null || req.user === undefined) {
    return res.render('forside', {
      language: reqLang(req, res)
    });
  }

  let user = res.locals.user;

  if (user instanceof models.Student) {
    res.render('forside-student', {
      language: reqLang(req, res)
    });
  }
  else if (user instanceof models.Virksomhed) {
    res.render('forside-virksomhed', {
      language: reqLang(req, res)
    });
  }
  else if (user instanceof models.Professor) {
    res.render('forside-professor', {
      language: reqLang(req, res)
    });
  }
  else if (user instanceof models.Admin) {
    res.render('forside-admin', {
      language: reqLang(req, res)
    });
  }
  
});
module.exports = router;
