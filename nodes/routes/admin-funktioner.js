var express = require('express');
var { reqLang } = require('../public/javascript/request');
const { route } = require('./opret-bruger');
var router = express.Router();

const editStudent = require('../persistence/usermapping').editStudent;
const deleteStudent = require('../persistence/usermapping').deleteStudent;


router.get('/', function (req, res, next) {
    res.render('admin-funktioner', {language: reqLang(req, res)})
});

router.post('/slet-student', function (req, res, next) {
    let jsonBody = JSON.stringify(req.body);
    console.log(jsonBody);
    res.send (jsonBody);
    deleteStudent(req.body.email)
});




module.exports = router;