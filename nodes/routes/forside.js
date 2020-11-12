var express = require('express');
var router = express.Router();
const { reqLang } = require('../public/javascript/request');


router.get('/', function (req, res, next) {
    res.render('forside', {
      language: reqLang(req ,res)
    })
  });
  module.exports=router;