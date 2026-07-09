// ==========================================================
// ACTIVE DATABASE CONNECTION FILE
// ==========================================================

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create the connection pool to MySQL
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'railwaydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('[DATABASE] MySQL connection pool initialized successfully.');

module.exports = dbPool;
