const mysql = require('mysql2');

const mypool=mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'12345678',
    database:"studentdb",
    multipleStatements:true,
})
module.exports = mypool.promise();