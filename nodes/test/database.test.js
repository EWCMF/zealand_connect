const mocha = require('mocha');
const db = require('../persistence/database-connection');

describe("Test database connection", function() {
    it("should connect to mariadb", function (done) {
        db.connect('46.101.225.211', 'root', 3306, 'zealand12345').then(conn => {
            conn.end()
            done();
        });
    })
});

describe