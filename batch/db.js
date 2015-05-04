var mysql = require('mysql')

exports.getConnection = function() {
    return mysql.createConnection({
        host: 'localhost',
        database: 'strix',
        user: 'root',
        password: ''
    });
};
