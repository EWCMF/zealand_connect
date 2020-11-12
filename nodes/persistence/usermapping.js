const models = require("../models");

async function findUserByName(usrnm){
    return new Promise(resolve => {
        console.log("---finding user by name"+usrnm+"---");
        models.User.findOne({ where: { username: usrnm } }).then(async (user) => {
            if (user === null) {
                console.log('user Not found!');
                resolve(null);
            } else {
                console.log("---i found the user:---");
                //console.log(user instanceof models.User); // true
                //console.log(user.username); // 'My Title'
                resolve(user);
            }
        });
    })
}

async function findUserById(id){
    return new Promise(resolve => {
        console.log("---finding user by ID:"+id+"---");
        models.User.findOne({ where: { id: id } }).then(async(user) => {
            if (user === null) {
                console.log('user Not found!');
                resolve(null);
            } else {
                console.log("---i found the user:---");
                //console.log(user instanceof models.User); // true
                //console.log(user.username); // 'My Title'
                resolve(user);
            }
        });
    })
} 

module.exports = {findUserByName: findUserByName, findUserById: findUserById}
