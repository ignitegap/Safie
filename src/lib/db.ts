// ============================================================================
// SAFIE — Unified Database Layer (Neon Serverless PostgreSQL + Persistent Fallback)
// Automatically initializes tables, syncs locally, and seamlessly connects to Neon
// ============================================================================

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
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

if (DATABASE_URL && !DATABASE_URL.includes('YOUR_NEON_PASSWORD') && !DATABASE_URL.includes('***')) {
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
    console.log('[Safie-DB] Neon PostgreSQL pool configured');
  } catch (err: any) {
    lastDbError = err.message || String(err);
    console.warn('[Safie-DB] Error initializing Neon pool, falling back to local persistent store:', err);
  }
} else {
  console.log('[Safie-DB] DATABASE_URL not yet active or contains placeholder. Running in resilient hybrid mode.');
}

export async function query(text: string, params?: any[]) {
  if (pool) {
    await ensureTables();
    return pool.query(text, params);
  }
  // Local in-memory mock fallback if pool is absent
  return { rows: [] as any[], rowCount: 0 };
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

      CREATE TABLE IF NOT EXISTS community_reports (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        category VARCHAR(50) NOT NULL,
        lat DECIMAL(10, 6) NOT NULL,
        lng DECIMAL(10, 6) NOT NULL,
        address TEXT,
        description TEXT NOT NULL,
        status VARCHAR(30) DEFAULT 'submitted',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS route_feedback (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        route_id VARCHAR(64),
        origin TEXT,
        destination TEXT,
        perceived_safety_rating INT NOT NULL,
        actual_lighting_rating INT NOT NULL,
        comments TEXT,
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
// Persistent JSON Disk Store (Ensures app works 100% out of the box with persistence)
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

const DATA_FILE = path.join(process.cwd(), 'data', 'safie-db.json');

function loadLocalData(): { users: UserRecord[]; sosEvents: SOSEventRecord[] } {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('[DB] Could not read local file store, initializing fresh:', e);
  }
  return {
    users: [
      {
        id: 'usr-demo-001',
        phone: '+919810012345',
        name: 'Priya Sharma (Demo Citizen)',
        passwordHash: '$2a$10$yC40b89/ZbKx8y3pVgLfj.0MO9aL7.goTkhmnOaoUMRWtI9srnTuu',
        emergencyContacts: [
          { name: 'Papa', phone: '+91-9811001122', relation: 'Father' },
          { name: 'Pooja (Roommate)', phone: '+91-9877003344', relation: 'Friend' },
        ],
        duressPin: '9876',
        createdAt: new Date().toISOString(),
      },
    ],
    sosEvents: [],
  };
}

function saveLocalData(data: { users: UserRecord[]; sosEvents: SOSEventRecord[] }) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn('[DB] Failed to save to local file store:', e);
  }
}

// ----------------------------------------------------------------------------
// Database Operations (Neon with Local File Persistence Fallback)
// ----------------------------------------------------------------------------
export const db = {
  isConfigured: () => isNeonConfigured,
  getLastError: () => lastDbError,

  async ping(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
    if (!pool) return { connected: false, error: 'Database URL not configured or in local fallback mode' };
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
      }
    }

    const localData = loadLocalData();
    return localData.users.find((u) => u.phone === phone) || null;
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
      }
    }

    const localData = loadLocalData();
    localData.users.push(fullUser);
    saveLocalData(localData);

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
      }
    }

    const localData = loadLocalData();
    localData.sosEvents.push(fullEvent);
    saveLocalData(localData);

    return fullEvent;
  },
};
