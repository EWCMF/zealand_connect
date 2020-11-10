
const UserModel = require("../models/user").User


async function findUserByName(usrnm){
    console.log("---finding user by name"+usrnm+"---");
    const user = await UserModel.findOne({ where: { username: usrnm } });
    if (user === null) {
        console.log('user Not found!');
        return null;
    } else {
        console.log("--- Wow! i found the user:---");
        console.log(user instanceof UserModel); // true
        console.log(user.username); // 'My Title'
        return user;
    }
}

module.exports = {findUserByName: findUserByName}