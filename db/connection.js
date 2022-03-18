const mysql = require('mysql2');

// Connect to database
const dbconn = mysql.createConnection(
   {
     host: 'localhost',
     user: 'root',  // Your MySQL username,
     password: 'BietDanhM0i!',  // Your MySQL password
     database: 'election'
   },
   console.log('Connected to the election database.')
 );

 module.exports = dbconn;