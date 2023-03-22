const util = require('util');
const mysql = require("mysql2");
//mysql://root:Iyh1PDpVYuQurg8YN9HM@containers-us-west-25.railway.app:6630/railway
const connection = mysql.createConnection({
    port: 6630,
    host: 'containers-us-west-25.railway.app',
    user: 'root',
    password: 'Iyh1PDpVYuQurg8YN9HM',
    database: 'railway',
    multipleStatements: true
});

const query = util.promisify(connection.query).bind(connection);
connection.connect();

exports.getTransactionHistory = async(event)=>{
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    const{id, role} = JSON.parse(event.body);

    let response = {};
    
    try {
        
    } catch (error) {
        
    }
}