-- ============================================================================
-- SAFIE — Master Database Schema for Neon PostgreSQL
-- Organization: org-wandering-pond-44280358
-- Project: noisy-shadow-23252383
-- Compatible with PostgreSQL 16+ / PostGIS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    emergency_contacts JSONB DEFAULT '[]'::jsonb,
    duress_pin VARCHAR(10) DEFAULT '9876',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SAFE HAVEN PARTNERS
CREATE TABLE IF NOT EXISTS safe_havens (
    haven_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- pharmacy_247, metro_security, hospital, petrol_pump, cafe_247
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

-- 3. ROAD SEGMENTS & LIGHTING
CREATE TABLE IF NOT EXISTS road_segments (
    segment_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    lat1 DECIMAL(10, 6) NOT NULL,
    lng1 DECIMAL(10, 6) NOT NULL,
    lat2 DECIMAL(10, 6) NOT NULL,
    lng2 DECIMAL(10, 6) NOT NULL,
    lighting_status VARCHAR(50) NOT NULL, -- verified_lit, partially_lit, unlit_dark_spot
    lighting_percentage INT DEFAULT 50,
    has_sidewalk BOOLEAN DEFAULT TRUE,
    sidewalk_condition VARCHAR(50) DEFAULT 'paved_continuous',
    commercial_activity VARCHAR(50) DEFAULT 'moderate',
    ccms_connected BOOLEAN DEFAULT FALSE,
    environmental_score INT DEFAULT 70,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. EMERGENCY SOS EVENTS
CREATE TABLE IF NOT EXISTS sos_events (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    phone VARCHAR(20),
    lat DECIMAL(10, 6) NOT NULL,
    lng DECIMAL(10, 6) NOT NULL,
    tier INT NOT NULL, -- 0 (Uneasy), 1 (Subtle), 2 (Duress), 3 (Acute SOS)
    duress_invoked BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'active',
    tracking_token VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. INDEXES FOR HIGH-CONCURRENCY GEOSPATIAL SEARCH
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_safe_havens_coords ON safe_havens(lat, lng);
CREATE INDEX IF NOT EXISTS idx_road_segments_zone ON road_segments(zone);
CREATE INDEX IF NOT EXISTS idx_sos_events_status ON sos_events(status);



-- 6. COMMUNITY HAZARD & INFRASTRUCTURE REPORTS
CREATE TABLE IF NOT EXISTS community_reports (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    category VARCHAR(50) NOT NULL, -- broken_streetlight, unlit_dark_spot, harassment, isolated_area, blocked_sidewalk
    lat DECIMAL(10, 6) NOT NULL,
    lng DECIMAL(10, 6) NOT NULL,
    address TEXT,
    description TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'submitted', -- submitted, verified, resolved
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ROUTE SAFETY FEEDBACK
CREATE TABLE IF NOT EXISTS route_feedback (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    route_id VARCHAR(64),
    origin TEXT,
    destination TEXT,
    perceived_safety_rating INT NOT NULL, -- 1 to 5
    actual_lighting_rating INT NOT NULL, -- 1 to 5
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_reports_coords ON community_reports(lat, lng);
CREATE INDEX IF NOT EXISTS idx_route_feedback_created ON route_feedback(created_at);
