var express = require('express');
var router = express.Router();

router.get('/en', function(req, res) {

    res.cookie('lang', 'en');
    
    res.redirect('back')
})

router.get('/da', function(req, res) {

    res.cookie('lang', 'da');
    
    res.redirect('back')
})

module.exports = router;