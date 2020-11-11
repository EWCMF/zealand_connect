const bcrypt = require('bcrypt');

//Todo: encrpytion password function



async function verifyPassword(htmlPwd, dbPwd){
    return new Promise(resolve =>{
        console.log('Trying to verify password from login: '+htmlPwd);
        bcrypt.compare(htmlPwd,dbPwd, function(err, result){
        if(result==true){
            console.log('--- PASSWORD MATCH THE DATABASE PASSWORD---');
            resolve(true);
        } else {
            console.log('passowrds did not match');
            resolve(false);
        }
    })
    })
}


module.exports = {verifyPassword: verifyPassword}