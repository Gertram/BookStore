let mysql = require('mysql2');

let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bookstore'
});

let promise_pool = pool.promise();


module.exports = promise_pool;