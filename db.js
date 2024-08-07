const mysql = require('mysql');

// Create connection to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lordfinn_db'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1);
    }
    console.log('MySQL connected...');
});

module.exports = db;
