var express = require('express');
var router = express.Router();

router.get('/en', function(req, res) {

    let allowed = req.cookies.cookie_consent;
    
    if (!allowed.includes('nolang')) {
        res.cookie('lang', 'en', {
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
    }
    
    res.redirect('back');
})

router.get('/da', function(req, res) {

    let allowed = req.cookies.cookie_consent;

    if (!allowed.includes('nolang')) {
        res.cookie('lang', 'da', {
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
    }
    
    res.redirect('back');
})

module.exports = router;