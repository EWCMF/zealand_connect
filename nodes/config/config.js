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
        "storage": ":memory:",
        "dialect": "sqlite",
        "logging": false
    },
    "production": {
        "username": process.env.DB_PROD_USER,
        "password": process.env.DB_PROD_PASS,
        "database": process.env.DB_PROD_DATABASE,
        "host": process.env.DB_PROD_HOST,
        "port": process.env.DB_PROD_PORT,
        "dialect": "mariadb",
        "logging": false
    }
}