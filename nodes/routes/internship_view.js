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

module.exports = router;