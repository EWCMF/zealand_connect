const fs = require('fs');
const uploadFolder = require('../constants/references').uploadFolder();

function unlinkOldFiles(filename) {
    fs.unlink(uploadFolder + filename, (err) => {
        if (err) throw err
        console.log(filename + " was deleted")
    });
}

module.exports = { unlinkOldFiles }