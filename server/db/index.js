// Import the Pool class from the 'pg' PostgreSQL client
const { Pool } = require("pg");

// Load environment variables from the .env file
require("dotenv").config();

// Create a new connection pool using the DATABASE_URL from the .env file
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // e.g., postgres://user:password@host:port/dbname
});

// Export the pool to be used in other parts of the application (e.g., controllers)
module.exports = pool;
