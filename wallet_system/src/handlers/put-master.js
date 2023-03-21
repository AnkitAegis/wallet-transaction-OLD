// Create clients and set shared const values outside of the handler.
const util = require('util');
const mysql = require("mysql2");
const db = require("../../env.json")
const url = db.mysqlURL;
const connection = mysql.createConnection(url);

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
