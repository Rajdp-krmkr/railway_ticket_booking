// ==========================================================
// DATABASE CONNECTION FILE
// ==========================================================

// TODO:
// Connect your RailwayDB database here.
//
// Placeholder configuration structure:
// HOST=
// USER=
// PASSWORD=
// DATABASE=

const dotenv = require('dotenv');
dotenv.config();

// Once you are ready to connect your MySQL database:
// 1. Install mysql2 package: `npm install mysql2`
// 2. Uncomment the connection code below and replace with your logic.

/*
const mysql = require('mysql2/promise');

const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'railway_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = dbPool;
*/

// Currently exporting a mock db connector that prints messages
const mockDb = {
  query: async (sql, params) => {
    console.log(`[MOCK DB] Executing query: ${sql} with params:`, params);
    return [];
  }
};

module.exports = mockDb;
