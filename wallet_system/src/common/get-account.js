// Create clients and set shared const values outside of the handler.
const {query ,connection}= require("./connectServer.js");

connection.connect();
    //ledger id creator, role, date, account, owner, debit, credit, comment;
    //user id master username  balance sharing role='user'
    //master id username role balance
exports.getAccount = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAccount only accept GET method, you tried: ${event.httpMethod}`);
    }
    let mapArr = ['admin','user','master'];

    try {
        // console.info('query',event.query)
        const {id, role} = event.queryStringParameters;
        let res;
        if(!mapArr.includes(role)){
            throw new Error('Invalid account');
        }
        if(role == 'user'){
            res = await query(`SELECT * FROM user WHERE id = ${id}`)
        }else{
            res = await query(`SELECT * FROM master WHERE id = ${id}`)
        }
        let [data] = res;
        response = {
            statusCode: 200,
            body: JSON.stringify(data)
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
