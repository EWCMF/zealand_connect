const models = require("../models");

async function findUserByEmail(email){
    let user = null;
    return new Promise(resolve => {
        console.log("---finding user by email: "+email+"---");
        models.Student.findOne({ where: { email: email } }).then((student) => {
            if (student === null) {
                console.log('en student med denne email findes ikke!');
            } 
            if(student instanceof models.Student) {
                console.log("---fandt en Student med mailen:---");
                //console.log(user instanceof models.User); // true
                //console.log(user.username); // 'My Title'
                user = student
            } 
        }).then(()=>{
            models.Virksomhed.findOne({ where: { email: email } }).then((virksomhed) => {
                if (virksomhed === null) {
                    console.log('en virksomhed med denne email findes ikke!');
                    //resolve(null);
                } 
                if(virksomhed instanceof models.Virksomhed) {
                    console.log("---fandt en Virksomhed med mailen:---");
                    //console.log(user instanceof models.User); // true
                    //console.log(user.username); // 'My Title'
                    user = virksomhed;
               }
               resolve(user);
            });
        }) 
    })
}

async function createVirksomhed(email){
    try {
        const virksomhed = await models.Virksomhed.create({email: email});
        console.log("A virksomhed was created");
        console.log(virksomhed instanceof models.Virksomhed);
        console.log(virksomhed.email);
    } catch (e) {
        console.log(e);
    }
}

async function deleteVirksomhed(email){
    try {
        await models.Virksomhed.destroy({
            where: {
                email: email
            }
        });
        console.log("A virksomhed was deleted")
    } catch (e) {
        console.log(e);
    }
}

module.exports = {findUserByEmail: findUserByEmail, createVirksomhed: createVirksomhed, deleteVirksomhed: deleteVirksomhed}