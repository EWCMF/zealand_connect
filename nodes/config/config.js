require('dotenv').config();

module.exports = {
    "development": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_DATABASE,
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "dialect": "mariadb",
        "logging": false
    },
    "test": {
        "username": "root",
        "password": "zealand12345",
        "database": "test",
        "host": "46.101.225.211",
        "port": "3306",
        "dialect": "mariadb",
        "logging": false
    },
    "production": {
        "username": "root",
        "password": "zealand12345",
        "database": "ZealandConnect",
        "host": "172.18.0.3",
        "port": "3306",
        "dialect": "mariadb"
    }
}