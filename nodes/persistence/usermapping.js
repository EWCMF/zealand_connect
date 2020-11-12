const models = require("../models");

async function findUserByEmail(email){
    return new Promise(resolve => {
        console.log("---finding user by email: "+email+"---");
        models.Student.findOne({ where: { email: email } }).then(async (student) => {
            if (student === null) {
                console.log('en student med denne email findes ikke!');
                resolve(null);
            } else {
                console.log("---i found the student:---");
                //console.log(user instanceof models.User); // true
                //console.log(user.username); // 'My Title'
                resolve(student);
            }
        });
    })
    //TODO når de andre bruger tabeller laves, så skal denne metode udvides btw
    //eller så kan denne metode deles til 3. findStudent, findVirksomhed, findAdmin. seperation of concerns?
}

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
} 

module.exports = {findUserByEmail: findUserByEmail, findUserById: findUserById}