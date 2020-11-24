var express = require('express');
var { reqLang } = require('../public/javascript/request');
var router = express.Router();


router.get('/', (req, res)=> {
    res.render('visprofil', {language: reqLang(req,res)})
})



module.exports = router;