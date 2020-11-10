var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
res.render('login')
    
});


router.post('/authenticateZealandConnect', function (req, res, next) {
    res.send(req)
        
    });
module.exports = router;