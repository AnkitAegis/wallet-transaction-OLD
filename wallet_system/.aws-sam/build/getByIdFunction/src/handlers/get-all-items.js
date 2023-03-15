// Create clients and set shared const values outside of the handler.
const util = require('util');
const mysql = require("mysql2");
const connection = mysql.createConnection(
    "mysql://root:AwqERVChDVXlPcYM8Zy5@containers-us-west-194.railway.app:6668/railway"
    );

const query = util.promisify(connection.query).bind(connection);
connection.connect();
/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getAllItemsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    let response = {};

    try {

        let result = await query(`CREATE TABLE Personsx 
        (ID int,
        PRIMARY KEY (ID));
             `);

        connection.end();

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
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
