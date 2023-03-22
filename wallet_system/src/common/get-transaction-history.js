// Create clients and set shared const values outside of the handler.
const {query ,connection}= require("./connectServer.js");
connection.connect();

exports.getTransactionHistory = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getTransactionHistory only accept GET method, you tried: ${event.httpMethod}`);
    }
    

    try {
        console.info('querystring',event.queryStringParameters)
        // console.info('query',event.query)

        const {id, role} = event.queryStringParameters;

        let res = await query(`SELECT * FROM ledger WHERE creator = ${id} && role = '${role}'`)

        response = {
            statusCode: 200,
            body: JSON.stringify(res)
        };
    } catch (ResourceNotFoundException) {
        console.info(ResourceNotFoundException)
        response = {
            statusCode: 404,
            body: ResourceNotFoundException
        };
    }

    // All log statements are written to CloudWatch
    return response;
}
