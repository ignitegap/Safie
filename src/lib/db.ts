// ============================================================================
// SAFIE — Neon PostgreSQL Database Connection Layer
// Configured for Neon Project: ep-twilight-darkness-azlrnihd
// Supports Neon serverless pooler + fallback mock store for instant resilience
// ============================================================================

import { Pool } from 'pg';
import { DELHI_NCR_SAFE_HAVENS, SafeHaven } from './data-delhi-ncr';

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

// Global pool cache to prevent connection leak in Next.js hot reload
declare global {
  var _neonPool: Pool | undefined;
  var _neonTablesInit: boolean | undefined;
}

let pool: Pool | null = null;
let isNeonConfigured = false;
let lastDbError: string | null = null;

if (DATABASE_URL && !DATABASE_URL.includes('YOUR_NEON_PASSWORD')) {
  try {
    if (!global._neonPool) {
      global._neonPool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
      });
    }
    pool = global._neonPool;
    isNeonConfigured = true;
    console.log('[Safie-DB] Neon PostgreSQL pool configured for ep-twilight-darkness-azlrnihd');
  } catch (err: any) {
    lastDbError = err.message || String(err);
    console.warn('[Safie-DB] Error initializing Neon pool, falling back to local store:', err);
  }
} else {
  console.log('[Safie-DB] DATABASE_URL not yet set or contains placeholder. Running in resilient hybrid mode.');
}

async function ensureTables() {
  if (!pool || global._neonTablesInit) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        password_hash TEXT NOT NULL,
        emergency_contacts JSONB DEFAULT '[]'::jsonb,
        duress_pin VARCHAR(10) DEFAULT '9876',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS safe_havens (
        haven_id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        category_label VARCHAR(100),
        lat DECIMAL(10, 6) NOT NULL,
        lng DECIMAL(10, 6) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(50),
        is_24_hours BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        amenities JSONB DEFAULT '{"powerCharging": true, "firstAid": true, "landlineAccess": true, "trainedStaff": true}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sos_events (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        phone VARCHAR(20),
        lat DECIMAL(10, 6) NOT NULL,
        lng DECIMAL(10, 6) NOT NULL,
        tier INT NOT NULL,
        duress_invoked BOOLEAN DEFAULT FALSE,
        status VARCHAR(30) DEFAULT 'active',
        tracking_token VARCHAR(64) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    global._neonTablesInit = true;
    console.log('[Safie-DB] Verified database tables on Neon.');
  } catch (err: any) {
    lastDbError = err.message || String(err);
    console.warn('[Safie-DB] Table verification note:', err.message);
  }
}

// ----------------------------------------------------------------------------
// In-Memory Resilient Store (Ensures app works 100% out of the box)
// ----------------------------------------------------------------------------
export interface UserRecord {
  id: string;
  phone: string;
  name: string;
  passwordHash: string;
  emergencyContacts: { name: string; phone: string; relation: string }[];
  duressPin: string;
  createdAt: string;
}

export interface SOSEventRecord {
  id: string;
  userId?: string;
  phone?: string;
  lat: number;
  lng: number;
  tier: number;
  duressInvoked: boolean;
  status: 'active' | 'resolved';
  timestamp: string;
  trackingToken: string;
}

const MEMORY_USERS: Map<string, UserRecord> = new Map();
const MEMORY_SOS: SOSEventRecord[] = [];

// Seed default test user (Phone: +919810012345 / Password: SafieDelhi2026!)
const DEFAULT_TEST_HASH = '$2a$10$3zR14Q0d674b3Vv/uD9sN.BfxR1w5nN0H1h4Vz1HkKxGeG.k1vE4S';

MEMORY_USERS.set('+919810012345', {
  id: 'usr-demo-001',
  phone: '+919810012345',
  name: 'Priya Sharma (Demo)',
  passwordHash: '$2a$10$p0b3h7E7k7Q4p5Z2l9j7fegx3G8X2d6m9V1h7J3k9Q5b8V2l6k1vE',
  emergencyContacts: [
    { name: 'Papa', phone: '+91-9811001122', relation: 'Father' },
    { name: 'Pooja (Roommate)', phone: '+91-9877003344', relation: 'Friend' },
  ],
  duressPin: '9876',
  createdAt: new Date().toISOString(),
});

// ----------------------------------------------------------------------------
// Database Operations (Neon with In-Memory Fallback)
// ----------------------------------------------------------------------------
export const db = {
  isConfigured: () => isNeonConfigured,
  getLastError: () => lastDbError,

  async ping(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
    if (!pool) return { connected: false, error: 'Database URL not configured' };
    const start = Date.now();
    try {
      await pool.query('SELECT 1');
      return { connected: true, latencyMs: Date.now() - start };
    } catch (err: any) {
      lastDbError = err.message || String(err);
      return { connected: false, error: err.message || String(err) };
    }
  },

  // User Operations
  async getUserByPhone(phone: string): Promise<UserRecord | null> {
    if (pool && isNeonConfigured) {
      try {
        await ensureTables();
        const res = await pool.query(
          'SELECT id, phone, name, password_hash as "passwordHash", emergency_contacts as "emergencyContacts", duress_pin as "duressPin", created_at as "createdAt" FROM users WHERE phone = $1 LIMIT 1',
          [phone]
        );
        if (res.rows.length > 0) return res.rows[0];
      } catch (err: any) {
        lastDbError = err.message;
        console.error('[DB] Neon query error, checking fallback store:', err.message);
      }
    }
    return MEMORY_USERS.get(phone) || null;
  },

  async createUser(user: Omit<UserRecord, 'id' | 'createdAt'>): Promise<UserRecord> {
    const newId = `usr-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const fullUser: UserRecord = {
      ...user,
      id: newId,
      createdAt,
    };

    if (pool && isNeonConfigured) {
      try {
        await ensureTables();
        await pool.query(
          `INSERT INTO users (id, phone, name, password_hash, emergency_contacts, duress_pin, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            newId,
            user.phone,
            user.name,
            user.passwordHash,
            JSON.stringify(user.emergencyContacts),
            user.duressPin,
            createdAt,
          ]
        );
      } catch (err: any) {
        lastDbError = err.message;
        console.error('[DB] Neon insert user error, saving in local fallback:', err.message);
      }
    }

    MEMORY_USERS.set(user.phone, fullUser);
    return fullUser;
  },

  // Safe Havens
  async getSafeHavens(): Promise<SafeHaven[]> {
    if (pool && isNeonConfigured) {
      try {
        await ensureTables();
        const res = await pool.query('SELECT * FROM safe_havens WHERE is_active = true');
        if (res.rows.length > 0) {
          return res.rows.map((r) => ({
            id: r.haven_id,
            name: r.name,
            category: r.category,
            categoryLabel: r.category_label || r.name,
            lat: Number(r.lat),
            lng: Number(r.lng),
            address: r.address,
            phone: r.phone || '112',
            is24Hours: Boolean(r.is_24_hours),
            verifiedBadge: true,
            amenities: {
              powerCharging: true,
              firstAid: true,
              landlineAccess: true,
              cctvMonitoring: true,
              trainedStaff: true,
            },
          }));
        }
      } catch (err: any) {
        lastDbError = err.message;
        console.warn('[DB] Could not query Neon safe_havens, returning curated Delhi NCR dataset:', err.message);
      }
    }
    return DELHI_NCR_SAFE_HAVENS;
  },

  // Emergency SOS Events
  async logSOSEvent(event: Omit<SOSEventRecord, 'id' | 'timestamp'>): Promise<SOSEventRecord> {
    const id = `sos-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const fullEvent: SOSEventRecord = { ...event, id, timestamp };

    if (pool && isNeonConfigured) {
      try {
        await ensureTables();
        await pool.query(
          `INSERT INTO sos_events (id, user_id, phone, lat, lng, tier, duress_invoked, status, created_at, tracking_token)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            id,
            event.userId || null,
            event.phone || null,
            event.lat,
            event.lng,
            event.tier,
            event.duressInvoked,
            event.status,
            timestamp,
            event.trackingToken,
          ]
        );
      } catch (err: any) {
        lastDbError = err.message;
        console.warn('[DB] Failed to log to Neon, logged in memory:', err.message);
      }
    }

    MEMORY_SOS.push(fullEvent);
    return fullEvent;
  },
};
