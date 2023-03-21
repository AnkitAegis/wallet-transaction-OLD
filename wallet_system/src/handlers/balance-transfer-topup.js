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
exports.balanceTransferHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`balanceTransferHandler only accept POST method, you tried: ${event.httpMethod}`);
    }
    console.info('received:', event);

    const body = JSON.parse(event.body);

    const {
        senderId,
        sender,
        receiverId,
        receiver,
        amount,
        actionType
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

        await query(`
            INSERT INTO ledger (creator, role, date, account, owner, debit, credit, comment) VALUES 
            (${senderId}, '${sender}', NOW(),${senderId}, '${sender}', ${amount}, 0, '${actionType}');
        `)
        await query(`
            INSERT INTO ledger (creator, role, date, account, owner, debit, credit, comment) VALUES 
            (${senderId}, '${sender}', NOW(),${receiverId}, '${receiver}', 0, ${amount}, '${actionType}');
        `)

        const balanceUpdate = await query(`
            UPDATE master SET balance = balance - ${amount} WHERE id = ${senderId};
        `);

        let receiverTopUp;
        if (receiver == 'master') {
            receiverTopUp = await query(`
                UPDATE master SET balance = balance + ${amount} WHERE id = ${receiverId};
                `);
        } else {
            receiverTopUp = await query(`
                UPDATE user SET balance = balance + ${amount} WHERE id = ${receiverId};
                `);
        }
        if (receiverTopUp && receiverTopUp.affectedRows == 0 && receiverTopUp.info !== "") {
            throw new Error("Unable to update receiver's balance");
        }

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
