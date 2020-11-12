var reqLang = function(req, res) {
    temp = 'da'
    if(req.cookies.lang == 'en') {
        temp = 'en';
    }    
    return temp
}
module.exports.reqLang = reqLang;