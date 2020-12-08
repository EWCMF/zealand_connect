const models = require("../models");


async function createUddanelse(name) {
    try{console.log('før findOne')
    models.Uddannelser.findOne({where: {name:name}}).then(
            console.log('uddannelser findes')
    )}
    catch (e) {console.log(e)}
    
}


async function findUddannelseByName(name) 
    let user = null;
    return new Promise(resolve =>{
        console.log("--finding uddannelse by Name: " + name + "---");
        models.Uddannelser.findOne({
            nest: true,
            where: {name:name}
        }).then((uddannelser) =>{
            if(uddannelser === null) {
                console.log('en uddannelse med dette navn findes ikke!')
            }
            if(uddannelser instanceof models.Uddannelser) {
                console.log("--- fandt en uddannelse med navnet ---");
                user = uddannelser
            }
            resolve(user)
        });
    })

module.exports = {
    createUddanelse: createUddanelse
}