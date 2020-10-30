const db = require('../persistence/database-connection');
const seq = require('../persistence/sequelize-tidlig');

describe("Test database connection", function () {
    it("should connect to mariadb", function (done) {
        db.connect().then(conn => {
            conn.end()
            done();
        });
    })
});


// Denne kan først implementeres når vi kan synkronisere tests

// describe("Test sequelize create", function () {
//     it("It should add a new CV to database", function (done) {
//         let testJSON = {
//             overskrift: "overskrift",
//             studieretning: "studieretning",
//             email: "email",
//             telefon: 55667788,
//             hjemmeside: "hjemmeside",
//             om: "om",
//             arbejdserfaring: "arbejdserfaring",
//             uddannelse: "uddannelse",
//             hobby: "hobby"
//         }

//         seq.newCV("test", testJSON).then(() => {
//             db.dropDatabase("test");
//             done();
//         });
//     })
// })

describe("Test sequelize read", function () {
    it("Should read a CV from database based on id", function (done) {

        let testJSON = {
            overskrift: "overskrift",
            studieretning: "studieretning",
            email: "email",
            telefon: 55667788,
            hjemmeside: "hjemmeside",
            om: "om",
            arbejdserfaring: "arbejdserfaring",
            uddannelse: "uddannelse",
            hobby: "hobby"
        }

        seq.newCV("test", testJSON).then(() => {
            seq.hentCV(1).then((obj) => {
                console.log(obj);
                done();
            });
        });
    })
})