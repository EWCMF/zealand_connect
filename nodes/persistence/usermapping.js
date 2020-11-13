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
                console.log("---i found the student:---");
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
                    console.log("---i found the Virksomhed:---");
                    //console.log(user instanceof models.User); // true
                    //console.log(user.username); // 'My Title'
                    user = virksomhed;
               }
               resolve(user);
            });
        }) 
    })
    //TODO når de andre bruger tabeller laves, så skal denne metode udvides btw
    //eller så kan denne metode deles til 3. findStudent, findVirksomhed, findAdmin. seperation of concerns?
}

// udkommenteret da den ikke bruges

/*
async function findUserById(id){
    return new Promise(resolve => {
        console.log("---finding user by ID:"+id+"---");
        models.Student.findOne({ where: { id: id } }).then(async(student) => {
            if (student === null) {
                console.log('student Not found!');
                resolve(null);
            } else {
                console.log("---i found the user:---");
                //console.log(user instanceof models.User); // true
                //console.log(user.username); // 'My Title'
                resolve(student);
            }
        });
    })
} */

module.exports = {findUserByEmail: findUserByEmail, /*findUserById: findUserById*/}