const path = require('path')
function uploadFolder() {
    if (process.env.LOCAL_UPLOAD) {
        return "public/uploads/"
    } else {
        return "/usr/src/app/public/uploads/";
    }
}  

module.exports = { uploadFolder }
