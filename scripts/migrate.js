const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const match = envContent.match(/DATABASE_URL="([^"]+)"/);
const connStr = match ? match[1] : '';

async function migrate() {
  const pool = new Pool({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
  const sql = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Neon database migration completed successfully');
  await pool.end();
}
migrate().catch(e => {
  console.error(e);
  process.exit(1);
});
