const mariadb = require('mariadb');

let connect = function(host, user, port, password) {
    return mariadb.createConnection({
        host: host,
        user: user,
        port: port,
        password: password
    });
}

module.exports.connect = function(host, user, port, password) {
    return connect(host, user, port, password);
}