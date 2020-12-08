const express = require('express');
var router = express.Router();
var {createUddanelse} = require('../persistence/uddanelsemapping')
var { reqLang } = require('../public/javascript/request');



router.get('/', (req,res) =>{
    res.render('uddannelse', {language: reqLang(req, res)})
})

router.post('/create', (req,res) =>{
    var jsonBody = JSON.parse(req.body)
    createUddanelse(jsonBody.name)
})




module.exports = router;