const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require("../persistence/sequelize-connection").sequelize


class User extends Model {}
User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING
}, { sequelize, modelName: 'user' });



module.exports = {User: User}