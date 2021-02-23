const bcrypt = require('bcryptjs');

//Todo: encrpytion password function


async function verifyPassword(htmlPwd, dbPwd) {
    return new Promise(resolve => {
        bcrypt.compare(htmlPwd, dbPwd, function (err, result) {
            if (result == true) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })
}

async function hashPassword(password) {
    let saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

module.exports = {verifyPassword: verifyPassword, hashPassword: hashPassword}
