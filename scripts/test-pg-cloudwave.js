const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: "postgresql://appuser:password@127.0.0.1:5432/cloudwave",
});

async function main() {
  console.log("Connecting to PG (cloudwave)...");
  try {
    await client.connect();
    console.log("Connected!");
    const res = await client.query('SELECT current_database()');
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
