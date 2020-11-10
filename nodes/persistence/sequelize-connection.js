const config = require('../persistence/config.json');
const Sequelize = require('sequelize');


const sequelize = new Sequelize(config.database, config.root, config.pass, {
    host: config.host,
    port: config.port,
    dialect: 'mariadb'
});

module.exports = {sequelize: sequelize}