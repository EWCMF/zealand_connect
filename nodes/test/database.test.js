const mocha = require('mocha');
const db = require('../persistence/database-connection');

describe("Test database connection", function() {
    it("should connect to mariadb", function (done) {
        db.connect('167.99.248.139', 'root', 8000, 'zealand12345').then(conn => {
            conn.end()
            done();
        });
    })
});

describe