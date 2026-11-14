const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_u0b3c6lKmqQv@ep-twilight-darkness-azlrnihd-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function migrate() {
  console.log('Connecting to Neon PostgreSQL...');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✓ Successfully connected to Neon database!');

    // Read and run schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'schema.sql'), 'utf8');
    console.log('Applying database schema (users, safe_havens, road_segments, sos_events)...');
    await client.query(schemaSql);
    console.log('✓ Schema applied successfully.');

    // Check existing count of safe_havens
    const countRes = await client.query('SELECT count(*) FROM safe_havens');
    console.log(`Current safe_havens in Neon: ${countRes.rows[0].count}`);

    // If empty, seed initial havens
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      console.log('Seeding initial Delhi-NCR Safe Havens into Neon...');
      const seedData = [
        {
          id: 'sh-ggm-001',
          name: 'Apollo Pharmacy 24/7 (Cyber Hub)',
          category: 'pharmacy_247',
          categoryLabel: '24/7 Apollo Pharmacy',
          lat: 28.4958,
          lng: 77.0895,
          address: 'Shop 14, Building 8B, DLF Cyber City, Gurugram',
          phone: '+91-124-4061234',
        },
        {
          id: 'sh-ggm-002',
          name: 'Rapid Metro Security Kiosk (Cyber City Station)',
          category: 'metro_security',
          categoryLabel: 'Metro Police & Security Desk',
          lat: 28.4942,
          lng: 77.0888,
          address: 'Cyber City Rapid Metro Gate 2, DLF Phase 2, Gurugram',
          phone: '112 / +91-124-2808000',
        },
        {
          id: 'sh-ggm-003',
          name: 'Fortis Memorial Research Institute (24/7 Emergency)',
          category: 'hospital',
          categoryLabel: 'Hospital 24/7 Emergency Hub',
          lat: 28.4595,
          lng: 77.0725,
          address: 'Sector 44, Opposite HUDA City Centre Metro, Gurugram',
          phone: '+91-124-4962200',
        },
        {
          id: 'sh-del-001',
          name: 'Delhi Police Central Assistance Booth (Rajiv Chowk)',
          category: 'metro_security',
          categoryLabel: 'Delhi Police Emergency Desk',
          lat: 28.6329,
          lng: 77.2195,
          address: 'Inner Circle Block B, Rajiv Chowk Metro Gate 7, Connaught Place, New Delhi',
          phone: '112 / 1091',
        },
        {
          id: 'sh-del-002',
          name: 'Apollo 24/7 Pharmacy (Connaught Place)',
          category: 'pharmacy_247',
          categoryLabel: '24/7 Apollo Pharmacy',
          lat: 28.6318,
          lng: 77.2182,
          address: 'Middle Circle, F Block, Connaught Place, New Delhi',
          phone: '+91-11-41512233',
        }
      ];

      for (const h of seedData) {
        await client.query(`
          INSERT INTO safe_havens (haven_id, name, category, category_label, lat, lng, address, phone, is_24_hours, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, true)
          ON CONFLICT (haven_id) DO NOTHING
        `, [h.id, h.name, h.category, h.categoryLabel, h.lat, h.lng, h.address, h.phone]);
      }
      console.log(`✓ Seeded ${seedData.length} Safe Havens into Neon.`);
    }

    // Verify test user
    const usersCount = await client.query('SELECT count(*) FROM users');
    console.log(`Current users in Neon: ${usersCount.rows[0].count}`);

    client.release();
    await pool.end();
    console.log('🎉 Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  }
}

migrate();
