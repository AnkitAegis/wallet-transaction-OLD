const mysql = require("mysql2");
const connection = mysql.createConnection(
  "mysql://root:AwqERVChDVXlPcYM8Zy5@containers-us-west-194.railway.app:6668/railway"
);

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});

connection.end();
