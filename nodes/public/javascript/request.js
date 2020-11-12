var reqLang = function(req, res) {
    temp = 'da'
    
    if(req.cookies.lang == 'en') {
        temp = 'en';
        console.log('yeah')
    } 


    
    
    return temp
}

var dd = function() {
     if(req.cookies.lang != null) {
        temp = req.cookies.lang
    }
    

    else if(req.cookies.lang == null) {
        temp = req.acceptsLanguages('da', 'en');
        if(temp == null) {
            temp = 'da'
        }    
        res.cookie(temp, req.params.lang)
    }
    

    if (temp != 'da' || 'en') {
        temp = 'da'
    }
}


module.exports.reqLang = reqLang;