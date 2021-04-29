const fs = require('fs');
const uploadFolder = require('../constants/references').uploadFolder();

function unlinkOldFiles(filename) {
    try {
        fs.unlink(uploadFolder + filename, (err) => {
            if (err) throw err
            console.log(filename + " was deleted")
        });
    } catch (e){
        console.log(e)
    }

}

module.exports = { unlinkOldFiles }