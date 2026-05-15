const mysql = require('mysql2/promise');
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: 'root',
    password: 'Kdamprai@17',
    database: 'ecommerce'
});

module.exports = db;