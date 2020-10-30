const config = require('../persistence/config.json');
const mariadb = require('mariadb');

function connect() {
    return mariadb.createConnection({
        host: config.testDB.host,
        user: config.testDB.user,
        port: config.testDB.port,
        password: config.testDB.pass
    });
}

function createDatabase(database) {
    return new Promise((resolve, reject) => {
        try {
            connect().then(conn => {
                conn.query('CREATE DATABASE IF NOT EXISTS ' + database);
                conn.end()
                resolve();
            });
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}

function dropDatabase(database) {
    return new Promise((resolve, reject) => {
        try {
            connect().then(conn => {
                conn.query('DROP DATABASE IF EXISTS ' + database);
                conn.end()
                resolve()
            });
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}

module.exports = {
    connect,
    dropDatabase,
    createDatabase
};