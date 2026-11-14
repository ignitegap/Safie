// ============================================================================
// SAFIE — Neon PostgreSQL Database Connection Layer
// Configured for Neon Project: noisy-shadow-23252383 (org-wandering-pond-44280358)
// Supports Neon serverless pooler + fallback mock store for instant local dev
// ============================================================================

import { Pool } from 'pg';
import { DELHI_NCR_SAFE_HAVENS, SafeHaven } from './data-delhi-ncr';

const DATABASE_URL = process.env.DATABASE_URL;

// Global pool cache to prevent connection leak in Next.js hot reload
declare global {
  var _neonPool: Pool | undefined;
}

let pool: Pool | null = null;
let isNeonConfigured = false;

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
    console.log('[Safie-DB] Connected to Neon PostgreSQL project noisy-shadow-23252383');
  } catch (err) {
    console.warn('[Safie-DB] Error initializing Neon pool, falling back to local store:', err);
  }
} else {
  console.log('[Safie-DB] DATABASE_URL not yet set or contains placeholder. Running in resilient hybrid mode.');
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

// Seed default test user (Phone: 9876543210 / Password: password123)
const DEFAULT_TEST_HASH = '$2a$10$w4rU8qgU7x7G9vK0HkKxGeG.k1vE4S1Xg0M.y0U8h5Q0q9G0q9G0q'; // Pre-hashed
MEMORY_USERS.set('9876543210', {
  id: 'usr-test-001',
  phone: '9876543210',
  name: 'Ananya Sharma',
  passwordHash: DEFAULT_TEST_HASH,
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

  // User Operations
  async getUserByPhone(phone: string): Promise<UserRecord | null> {
    if (pool && isNeonConfigured) {
      try {
        const res = await pool.query(
          'SELECT id, phone, name, password_hash as "passwordHash", emergency_contacts as "emergencyContacts", duress_pin as "duressPin", created_at as "createdAt" FROM users WHERE phone = $1 LIMIT 1',
          [phone]
        );
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.error('[DB] Neon query error, checking fallback store:', err);
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
      } catch (err) {
        console.error('[DB] Neon insert user error, saving in local fallback:', err);
      }
    }

    MEMORY_USERS.set(user.phone, fullUser);
    return fullUser;
  },

  // Safe Havens
  async getSafeHavens(): Promise<SafeHaven[]> {
    if (pool && isNeonConfigured) {
      try {
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
            phone: r.phone,
            is24Hours: r.is_24_hours,
            verifiedBadge: r.is_active,
            amenities: r.amenities || {
              powerCharging: true,
              firstAid: true,
              landlineAccess: true,
              cctvMonitoring: true,
              trainedStaff: true,
            },
          }));
        }
      } catch (err) {
        console.warn('[DB] Could not query Neon safe_havens, returning curated Delhi NCR dataset:', err);
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
      } catch (err) {
        console.warn('[DB] Failed to log to Neon, logged in memory:', err);
      }
    }

    MEMORY_SOS.push(fullEvent);
    return fullEvent;
  },
};
