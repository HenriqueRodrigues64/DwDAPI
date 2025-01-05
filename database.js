const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Dinossauro03",
    database: "deal_with_dreams_db" // Schema name 
});

module.exports = connection