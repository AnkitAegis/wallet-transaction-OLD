// Create clients and set shared const values outside of the handler.
const {query ,connection}= require("../common/connectServer.js");
connection.connect();
/**
 * A simple example includes a HTTP get method to get all items from a railway MYSQL table.
 */
exports.balanceSharingHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`balanceSharingHandler only accept POST method, you tried: ${event.httpMethod}`);
    }
    console.info('received:', event);

    const body = JSON.parse(event.body);

    const {
        senderId,
        sender,
        receiverId,
        receiver,
        amount,
    } = body;

    let response = {};
    const results = [];
    //ledger id creator, role, date, account, owner, debit, credit, comment;
    //user id master username  balance sharing role='user'
    //master id username role balance
    try {

        await query("START TRANSACTION")

        const [dataBalance] = await query(`SELECT balance FROM master WHERE id = ${senderId};`)
        const {balance} = dataBalance;
        // console.info(balance)
        if((balance - amount) < 0){
            throw new Error('low balance');
        }

        const [dataSharing] = await query(`SELECT sharing FROM user WHERE id = 2;`)
        const {sharing} = dataSharing;
        if(sharing == 0){
            throw new Error('sharing disabled');
        }

        await query(`
            INSERT INTO ledger (creator, role, date, account, owner, debit, credit, comment) VALUES 
            (${senderId}, '${sender}', NOW(),${senderId}, ${sender}, ${amount}, 0, "sharing");
        `)
        await query(`
            INSERT INTO ledger (creator, role, date, account, owner, debit, credit, comment) VALUES 
            (${senderId}, '${sender}', NOW(),${receiverId}, ${receiver}, 0, ${amount}, "sharing");
        `)

        const balanceUpdate = await query(`
            UPDATE master SET balance = balance - ${amount} WHERE id = ${senderId};
        `);

        results.push(balanceUpdate);

        if(balanceUpdate.affectedRows == 0 && balanceUpdate.info !== ""){
            throw new Error("something went wrong!!!")
        }

        await query("COMMIT")
        response = {
            statusCode: 200,
            body: JSON.stringify({res:results,message:'trasaction done'})
        };
    } catch (ResourceNotFoundException) {
        await query("ROLLBACK")
        response = {
            statusCode: 404,
            body: ResourceNotFoundException,
            

        };
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}