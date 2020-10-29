const db = require('../persistence/database-connection');
const config = require('../persistence/config.json');

describe("Test database connection", function() {
    it("should connect to mariadb", function (done) {
        let host = config.testDB.host;
        let user = config.testDB.user;
        let port = config.testDB.port;
        let pass = config.testDB.pass;

        db.connect(host, user, port, pass).then(conn => {
            conn.end()
            done();
        });
    })
});