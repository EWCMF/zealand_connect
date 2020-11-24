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

module.exports = {findUserByEmail: findUserByEmail, }