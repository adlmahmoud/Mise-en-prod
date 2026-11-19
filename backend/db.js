const { Pool } = require('pg');
require('dotenv').config();

// Supabase et les bases de données distantes nécessitent SSL
const isRemoteDb =
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes('localhost') &&
  !process.env.DATABASE_URL.includes('127.0.0.1');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
