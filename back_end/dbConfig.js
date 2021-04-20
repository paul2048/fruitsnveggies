// Import the environment variables, namely `DB_USER`, `DB_PASSWORD`, `DB_HOST`,
// `DB_PORT`, and `DB_DATABASE`. The variables are credentials used for
// connecting to a remote database. 
require('dotenv').config({ path: __dirname + '/../.env' });

const { Pool } = require('pg');

// Create a pool for the remote PostgreSQL database. 
const pool = new Pool({
  // Use the environment variables
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false },
  // Maximum number of connections in the pool
  max: 20,
  // If all the connections are busy, wait until a new connection is available
  connectionTimeoutMillis: 0,
  // Never close any connection
  idleTimeoutMillis: 0
});

module.exports = { pool };