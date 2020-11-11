const  DataTypes = require("sequelize");
const sequelize = require('./sequelize-connection').sequelize;


const UserModel = require("../models/user")(sequelize,DataTypes);


async function findUserByName(usrnm){
    console.log(UserModel);
    console.log("---finding user by name"+usrnm+"---");
    const user = await UserModel.findOne({ where: { username: usrnm } });
    if (user === null) {
        console.log('user Not found!');
        return null;
    } else {
        console.log("---OMG! i found the user:---");
        console.log(user instanceof UserModel); // true
        console.log(user.username); // 'My Title'
        return user;
    }
}

async function findUserById(id){
    console.log("---finding user by ID:"+id+"---");
    const user = await User.findOne({ where: { id: id } });
    if (user === null) {
        console.log('user Not found!');
        return null;
    } else {
        console.log("---OMG! i found the user:---");
        console.log(user instanceof User); // true
        console.log(user.username); // 'My Title'
        return user;
    }
} 

module.exports = {findUserByName: findUserByName, findUserById: findUserById}
