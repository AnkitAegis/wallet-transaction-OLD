// Create clients and set shared const values outside of the handler.
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
/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.putMasterHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`putMasterHandler only accept POST method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);


    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const balance = body.balance;
    const username = body.username;
    const role = body.role
    let response = {};

    try {

    
        let result = await query(`
        INSERT INTO master (username ,role ,balance)
            VALUES ('${username}', '${role}' ,${balance});
             `);

        

        response = {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: ResourceNotFoundException
        };
    }

    // All log statements are written to CloudWatch
    // console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
