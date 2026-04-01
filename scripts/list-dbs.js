const { Client } = require('pg');
require('dotenv').config();

// Connect to default 'postgres' database to list others
const connectionString = process.env.DATABASE_URL.replace(/\/[^/]+$/, '/postgres');

async function main() {
  console.log("Connecting to PG at:", connectionString);
  const client = new Client({
    connectionString,
  });
  try {
    await client.connect();
    console.log("Connected to 'postgres'. Listing databases...");
    const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
    console.log("Databases found:", res.rows.map(r => r.datname));
  } catch (err) {
    console.error("PG error:", err.message);
  } finally {
    try {
      await client.end();
    } catch (e) {}
  }
}

main();
