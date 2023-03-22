// Create clients and set shared const values outside of the handler.
const util = require('util');
const mysql = require("mysql2");
// const Query = require('mysql2/typings/mysql/lib/protocol/sequences/Query');


const connection = mysql.createConnection({
    port: 6630,
    host: 'containers-us-west-25.railway.app',
    user: 'root',
    password: 'Iyh1PDpVYuQurg8YN9HM',
    database: 'railway',
    multipleStatements: true
});

const query = util.promisify(connection.query).bind(connection);

module.exports = {connection,query};