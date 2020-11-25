const bcrypt = require('bcryptjs');

//Todo: encrpytion password function


async function verifyPassword(htmlPwd, dbPwd) {
    return new Promise(resolve => {
        console.log('Trying to verify password from login:');
        bcrypt.compare(htmlPwd, dbPwd, function (err, result) {
            if (result == true) {
                console.log('--- PASSWORD MATCH THE DATABASE PASSWORD---');
                resolve(true);
            } else {
                console.log('password did not match' + htmlPwd);
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
