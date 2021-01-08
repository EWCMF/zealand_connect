const fs = require('fs')

function unlinkOldFiles(filename) {
    fs.unlink("/usr/src/app/public/uploads/" + filename, (err) => {
        if (err) throw err
        console.log(filename + " was deleted")
    });
}

module.exports = { unlinkOldFiles }