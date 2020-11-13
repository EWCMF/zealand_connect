const models = require("../models");

async function createUser(email){
    return new Promise(resolve => {
        const virksomhed = models.Virksomhed.create({email: "test@mail.dk"}).then(async (virksomhed) =>{
            console.log(virksomhed.email);
        });
    })
}

module.exports = {createUser: createUser}
