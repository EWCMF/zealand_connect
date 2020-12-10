const { response } = require('express');
var express = require('express');
const { deleteVirksomhed } = require('../persistence/usermapping');
var { reqLang } = require('../public/javascript/request');
const {createUddanelse, findUddannelseByName, sletUddannelse} = require('../persistence/uddanelsemapping');

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


router.post('/createUddannelse', (req, res, next)=>{
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name
    let messages= {
        findesallerede: "",
        uddannelseOprettet: ""
    }
   
   findUddannelseByName(name).then((uddannelseFundetMedNavn) =>{
       if(uddannelseFundetMedNavn !== null) { //hvis uddannelsen er i databasen
           messages.findesallerede = "Uddannelsen findes allerede"
           res.send(messages)
       }
       else { // hvis uddannelsen ikke er i databasen
            createUddanelse(name);
            messages.uddannelseOprettet= "Uddannelsen oprettet"
            res.send(messages)
        }
   })
});

router.post('/sletUddannelse', (req, res, next)=> {
    let jsonBody = JSON.parse(req.body);
    let name = jsonBody.name;
    let messages = {
        findesIkke: "",
        uddannelseSlettet: ""
    }

    findUddannelseByName(name).then((uddannelseFundetMedNavn)=>{
        if(uddannelseFundetMedNavn === null) {
            console.log('sletter ikke noget der ikke findes')
            messages.findesIkke= "Uddannelsen findes ikke"
            res.send(messages);
        }
        else {
            console.log('sletter uddannelse')
            sletUddannelse(name)
            messages.uddannelseSlettet = "Uddannelsen slettet"
            res.send(messages)
        }
    })
})


module.exports = router;