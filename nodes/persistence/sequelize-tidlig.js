const config = require('./config.json');
const db = require('./database-connection');

const {
    Sequelize,
    Model,
    DataTypes
} = require('sequelize');

// Create a Sequelize object with options
var sequelize;

function makeSequelizeObject() {
    sequelize = new Sequelize({
        host: config.testDB.host,
        dialect: 'mariadb',
        /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
        dialectOptions: {
            timezone: 'Etc/GMT+0'
        },
        username: config.testDB.user,
        password: config.testDB.pass,
        port: config.testDB.port,
        database: config.testDB.database,
        logging: false
    });
}

function connect() {
    makeSequelizeObject();
    // sequelize
    //     .authenticate()
    //     .then(() => {
    //         // console.log("Sucessful");
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
}

function initCV(CV) {
    CV.init({
        overskrift: DataTypes.STRING,
        studieretning: DataTypes.STRING,
        email: DataTypes.STRING,
        telefon: DataTypes.INTEGER,
        hjemmeside: DataTypes.STRING,
        om: DataTypes.STRING,
        arbejdserfaring: DataTypes.STRING,
        uddannelse: DataTypes.STRING,
        hobby: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'cv'
    });
}

function newCV(database, cvJSON) {
    // Create a user and add it to the users table (inserted into database immediately)
    return new Promise((resolve, reject) => {
        try {
            db.createDatabase(database).then(() => {
                connect();

                class CV extends Model {}
                initCV(CV);

                (async () => {
                    await sequelize.sync(); // Synchronizes all models with the database, and creates the Users table if it doesn't exist (User is automatically pluralized)
                    const cv = await CV.create({
                        overskrift: cvJSON.overskrift,
                        studieretning: cvJSON.studieretning,
                        email: cvJSON.email,
                        telefon: cvJSON.telefon,
                        hjemmeside: cvJSON.hjemmeside,
                        om: cvJSON.om,
                        arbejdserfaring: cvJSON.arbejdserfaring,
                        uddannelse: cvJSON.uddannelse,
                        hobby: cvJSON.uddannelse
                    });
                    // console.log(cv.toJSON());
                    sequelize.close()
                    resolve()
                })();
            });
        } catch (err) {
            console.log(err);
            reject()
        }
    })
}

// function hentCV(database, id) {
//     return new Promise((resolve, reject) => {
//         try {
//             class CV extends Model {}
//             initCV(CV);

//             (async () => {
//                 await sequelize.sync();
//                 const cv = await CV.findOne()

//             })
//         } catch(err) {
//             console.log(err);
//             reject()
//         }
//     })
// }

async function hentCV(id) {
    connect();

    class CV extends Model {}
    initCV(CV);
    // const cv = await CV.findOne({
    //     where: {
    //         id: id
    //     }
    // }).then(() => {
    //     sequelize.close();
    // });
    // // console.log(cv);
    // return cv.toJSON();

    return await CV.findOne({
        where: {
            id: id
        }
    }).then((cv) => {
        sequelize.close();
        return cv.toJSON();
    });
    // console.log(cv);
    // return cv.toJSON();
}

module.exports = {
    connect,
    newCV,
    hentCV
}