// Create clients and set shared const values outside of the handler.
const util = require('util');
const mysql = require('mysql2')

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
/**
 * A simple example includes a HTTP get method to get all items from a railway MYSQL table.
 */
exports.getTransactionHistoryHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`getTransactionHistoryHandler only accept POST method, you tried: ${event.httpMethod}`);
    }
    console.info('received:', event);

    const queryParam = JSON.parse(event.query);

    const {
        
    } = queryParam;

    let response = {};
    const results = [queryParam];
    //ledger id creator, role, date, account, owner, debit, credit, comment;
    //user id master username  balance sharing role='user'
    //master id username role balance
    try {

        console.info(queryParam)
        response = {
            statusCode: 200,
            body: JSON.stringify({res:results,message:'trasaction done'})
        };
    } catch (ResourceNotFoundException) {
        
        response = {
            statusCode: 404,
            body: ResourceNotFoundException,
            

        };
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}