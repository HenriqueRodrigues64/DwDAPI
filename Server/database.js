const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: "4ayb4.h.filess.io",
    user: "DealWithDreams_definition",
    port: "3307",
    password: "2b79fd48ecc733b1b218b61851b97a011c57691a",
    database: "DealWithDreams_definition" // Schema name 

    //host: "localhost",
    //user: "root",
    //password: "Dinossauro03",
    //database: "deal_with_dreams_db" // Schema name 
});

module.exports = connection