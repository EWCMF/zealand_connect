var express = require('express');
var { reqLang } = require('../public/javascript/request');
const {createUddanelse, findUddannelseByName} = require('../persistence/uddanelsemapping');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('admin-funktioner', {language: reqLang(req, res)})
});

router.post('/createUddannelse', (req, res, next)=>{
    console.log('admin-funktioner/createUddannelse')
    let jsonBody = JSON.parse(req.body);

    let name = jsonBody.name

    console.log(name)
    let messages= {
        findesallerede: "",
        uddannelseOprettet: ""
    }
   
   findUddannelseByName(name).then((uddannelseFundetMedNavn) =>{
       if(uddannelseFundetMedNavn !== null) { //hvis uddannelsen er i databasen
           messages.findesallerede = "Uddannelse findes allerede"
           res.send(messages)
       }
       else { // hvis uddannelsen ikke er i databasen
            console.log('Opretter uddannelse')
            createUddanelse(name);
            messages.uddannelseOprettet= "Uddannelse oprettet"
            res.send(messages)

    }

   })
});


module.exports = router;