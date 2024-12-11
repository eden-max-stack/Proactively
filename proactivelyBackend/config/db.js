const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // your MySQL username
    password: 'Detained_Luxury3',  // your MySQL password
    database: 'proactively'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

module.exports = db.promise();