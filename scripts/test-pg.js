const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log("Connecting to PG...");
  console.log("Using URL:", process.env.DATABASE_URL);
  try {
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT current_database(), current_user');
    console.log("DB Info:", res.rows[0]);
  } catch (err) {
    console.error("PG error:", err.message);
  } finally {
    try {
      await client.end();
    } catch (e) {}
  }
}

main();
