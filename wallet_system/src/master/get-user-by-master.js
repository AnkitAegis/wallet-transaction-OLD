// Create clients and set shared const values outside of the handler.
const {query ,connection}= require("../common/connectServer.js");

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getUsersByMaster = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`get all users of masters only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    const id = JSON.parse(event.pathParameters.id);
    const q = JSON.parse(event.queryStringParameters);

    console.info('query',q)
    console.info('paramsid',id)
    let response = {};

    try {

        connection.connect();
        let result = await query(`
        SELECT * FROM user WHERE master = ${id};
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
