const { response } = require('express');
var express = require('express');
const { deleteVirksomhed } = require('../persistence/usermapping');
var { reqLang } = require('../public/javascript/request');
const { route } = require('./opret-bruger');
var router = express.Router();

const editStudent = require('../persistence/usermapping').editStudent;
const deleteStudent = require('../persistence/usermapping').deleteStudent;


router.get('/', function (req, res, next) {
    res.render('admin-funktioner', {language: reqLang(req, res)})
});

router.post('/slet-bruger', function (req, res, next) {
    let jsonBody = JSON.parse(req.body);
    console.log(req.body);
    let errorHappened = false;
    if (jsonBody.type == "virksomhed"){
        deleteVirksomhed(jsonBody.email).then((result)=>{
            errorHappened = result;
            res.send('{"errorHappened":'+errorHappened+"}");
        });
    }else {
        deleteStudent(jsonBody.email).then((result)=>{
            errorHappened = result;
            res.send('{"errorHappened":'+errorHappened+"}");
        });
    }
});




module.exports = router;