// Create clients and set shared const values outside of the handler.
const {query ,connection}= require("./connectServer.js");
connection.connect();

exports.getAllAccounts = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllAccounts only accept GET method, you tried: ${event.httpMethod}`);
    }
    console.info('received:', event);

    let response = {};

    try {
        const {table} = event.queryStringParameters;
        let result;
        if(table == "user"){
            result = await query(`
            SELECT * FROM user;
                 `);
        }else{
            result = await query(`
            SELECT * FROM master;
                 `);
        }
        
        // connection.end();

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
