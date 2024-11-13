// Import the Pool class from the 'pg' (node-postgres) package
const { Pool } = require("pg");

// Load environment variables from a .env file into process.env
require("dotenv").config();

// Destructure necessary PostgreSQL connection variables from process.env
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

/**
 * Create a new Pool instance with the PostgreSQL connection details.
 * 
 * The configuration object contains the following properties:
 * - user: The PostgreSQL username (PGUSER)
 * - password: The PostgreSQL user's password (PGPASSWORD)
 * - host: The hostname of the PostgreSQL server (PGHOST)
 * - database: The name of the PostgreSQL database (PGDATABASE)
 * - port: The port number to connect to PostgreSQL (default is 5432)
 * - ssl: Enable SSL connection (true)
 */
const pool = new Pool({
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    database: PGDATABASE,
    port: 5432,
    ssl: true,
});

// Export the pool instance for use in other parts of the application
module.exports = { pool };