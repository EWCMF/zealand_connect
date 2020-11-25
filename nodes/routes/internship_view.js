const e = require('express');
var express = require('express');
var router = express.Router();
const db = require('../models');

router.get('/', function (req, res, next) {
  res.render('view_post', {
    title: 'Express',
  })
});

router.get('/:id', function (req, res) {
    let id = req.params.id

    db.InternshipPost.findByPk(id, {attributes:["title","email","contact","education","country","region","post_start_date","post_end_date","post_text","city","postcode","cvr_number","company_link","company_logo","post_document"]}).then(result => {
        //når vi kalder noget r, f.eks. rtitle eller remail er det for at refere til resultat så der principelt set kommer til at stå "result email"
        res.render('view_post', {title:result['title'],rid:req.query.id,rtitle:result['title'],remail:result['email'],rcontact:result['contact'],reducation:result['education'],rcountry:result['country'],rregion:result['region'], rpoststart/*start date*/: result['post_start_date'], rpostend:/*end date*/ result['post_end_date'], rtext/*post_text*/:result['post_text'], rcity:result['city'], rpostcode:result['postcode'],rcvr:result['cvr_number'],rcompany:result['company_link'],rlogo:result["company_logo"],rdoc:result["post_document"]});
      }).catch();

});

/*router.post('/submit', function (req, res, next) {

  let overskrift = req.body.overskrift;
  let uddannelse = req.body.uddannelse;
  let email = req.body.email;
  let sprog = req.body.sprog;
  let speciale = req.body.speciale;
  let telefon = req.body.telefon;
  let linkedIn = req.body.linkedIn;
  let yt_link = req.body.youtube_link;
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
    yt_link,
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

router.get('/delete', function (req, res, next) {
  if (req.query.id == null) {
    res.send("Use id");
  } else {
    db.CV.destroy({
      where:{
        id:req.query.id
      }
    });
    res.send("Entry deleted");
  }
});*/

module.exports = router;