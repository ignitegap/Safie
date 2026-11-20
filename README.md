<p align="center">
  <img src="Logo.png" alt="Safie Logo" width="220" />
</p>

# Safie

### Women's Urban Safety Intelligence Platform & Pedestrian Navigation OS

**Tagline:** Move with clarity. Walk with certainty.  
**Live Production Web Application:** [https://safie-sooty.vercel.app/](https://safie-sooty.vercel.app/)  
**Direct Android APK Download:** [https://safie-sooty.vercel.app/downloads/safie-v1.0.0-delhi-ncr.apk](https://safie-sooty.vercel.app/downloads/safie-v1.0.0-delhi-ncr.apk)  
**GitHub Repository:** [https://github.com/ignitegap/Safie](https://github.com/ignitegap/Safie)  
**Competition Track:** The Corporate Glitch '26 - Builders Hub (Category: Women Safety & Urban Mobility)

---

## Executive Summary

Standard navigation applications (such as Google Maps or Apple Maps) optimize strictly for travel time and physical distance. For women, night-shift professionals, students, and pedestrians walking after dusk in metropolitan areas like Delhi NCR, the shortest path often routes through unlit service alleys, desolate stretches, and blind turns.

Safie is an urban safety intelligence engine and navigation system that replaces pure distance metrics with safety-weighted environmental routing. It integrates smart municipal lighting telemetry (modeled on GMDA CCMS SCADA systems), a verified 24/7 sanctuary network ("Ask for Angela"), off-grid BLE mesh emergency relays, and a Noonlight-inspired Dead Man's Switch with covert duress capabilities.

---

## Core Capabilities

### 1. Intelligent Pedestrian Safety Routing
* Computes dual walking routes: Safie Recommended Safe Route versus Fastest Shortcut.
* Powered by live Open Source Routing Machine (OSRM) pedestrian engine with OpenStreetMap Nominatim geocoding worldwide.
* Evaluates routes using a multi-factor Night Activity Score (0 to 100):
  * Open establishments and 24/7 commercial frontages (25 points).
  * Street lighting status and CCMS smart pole coverage (25 points).
  * Arterial main road ratio versus unclassified back-alleys (25 points).
  * Proximity to emergency access points and safe havens (25 points).

### 2. "Ask for Angela" Physical Sanctuary Network
* Catalog of 28 pre-verified, round-the-clock physical refuges across Gurugram and Delhi.
* Includes 24/7 Apollo pharmacies, DMRC and Rapid Metro security stations, hospital emergency rooms, and illuminated fuel stations.
* Interactive 1-click detour routing dynamically recalculates the user's path to guide them directly to the nearest staffed haven.

### 3. Safety Hold (Dead Man's Switch Engine)
* Armable thumb-hold switch designed for uneasy situations (dark parking lots, desolate transit exits).
* Releasing the switch starts an immediate 10-second auditory and sensory countdown.
* Dual-PIN Verification:
  * Normal PIN (`1234`): Disarms the system safely.
  * Covert Duress PIN (`9876`): Deceptively presents an "Alarm Cancelled" confirmation screen to an attacker or coerced bystander while silently dispatching high-priority emergency alerts with live GPS telemetry to the cloud backend.
* Countdown expiration automatically triggers Tier-3 SOS dispatch.

### 4. Acoustic Deterrent (Synthesized Fake Call)
* Browser and native mobile integration invoking the Web Speech API and native audio pipelines.
* Simulates an incoming call with a realistic caller screen and natural voice conversation to provide commuters with an assertive deterrent against stalkers.

### 5. Zero-Data BLE Mesh Flood Relay
* Multi-hop emergency transmission protocol utilizing Bluetooth Low Energy (BLE).
* Designed for deep basements, isolated alleys, or crowded areas experiencing mobile cellular network blackouts.
* Packets hop device-to-device with a Time-To-Live (TTL) of up to 5 hops until an internet-connected node uplinks the payload to authorities and emergency contacts.

### 6. Crowdsourced Hazard Reporting & Feedback
* Live persistence pipeline connected to Neon Serverless PostgreSQL.
* Allows commuters to pin and submit dark spots, broken streetlights, catcalling hotspots, and sidewalk obstructions.
* Post-trip rating modal capturing perceived safety scores and ground-truth lighting conditions.

---

## Technology Stack

### Web & API Platform
* Framework: Next.js 14 (App Router)
* Language: TypeScript 5
* Styling: Tailwind CSS (Calm rose-neutral design system, fully unslop)
* Map Rendering: Leaflet with OpenStreetMap clean raster tiles (zero API key watermarks)
* Geocoding & Routing: Nominatim OSM Geocoding API + OSRM Foot Routing Engine
* Database: Neon Serverless PostgreSQL (AWS ap-southeast-1 pooler instance)
* Deployment: Vercel

### Android Mobile Client
* Language: Kotlin 1.9.22
* UI Framework: Jetpack Compose with Material3
* Target Platform: Android 14 (API level 34)
* Minimum SDK: Android 8.0 (API level 26)
* Background Execution: Android Foreground Service with persistent status bar notification
* Build Tool: Gradle 8.7 with Android Gradle Plugin (AGP) 8.2.2

---

## Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                                  USER CLIENTS                                 |
|                                                                               |
|   +------------------------------------+   +------------------------------+   |
|   |   Next.js 14 Responsive Web App    |   | Native Android Client (APK)  |   |
|   |  - Leaflet Map & Safe Havens       |   | - Jetpack Compose UI         |   |
|   |  - In-Browser Phone Simulator      |   | - SafetyHoldManager Engine   |   |
|   |  - Hazard Reporting Modals         |   | - BleMeshRelay Protocol      |   |
|   +-----------------+------------------+   +--------------+---------------+   |
+---------------------|-------------------------------------|-------------------+
                      |                                     |
                      v                                     v
+-------------------------------------------------------------------------------+
|                               SAFIE BACKEND APIS                              |
|                                                                               |
|   +-------------------+  +-------------------+  +-------------------------+   |
|   |  /api/routes      |  |  /api/safe-havens |  |  /api/reports           |   |
|   |  OSRM Pedestrian  |  |  28 Curated Spots |  |  Community Hazard Input |   |
|   +-------------------+  +-------------------+  +-------------------------+   |
|   +-------------------+  +-------------------+  +-------------------------+   |
|   |  /api/feedback    |  |  /api/sos         |  |  /api/auth              |   |
|   |  Commuter Ratings |  |  Tier-3 Dispatch  |  |  Session Management     |   |
|   +-------------------+  +-------------------+  +-------------------------+   |
+------------------------------------+------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------------+
|                           NEON POSTGRESQL DATABASE                            |
|                                                                               |
|   - users (phone, credentials, emergency_contacts, duress_pin)                |
|   - safe_havens (haven_id, name, lat, lng, amenities, is_24_hours)            |
|   - road_segments (segment_id, zone, lighting_status, ccms_connected)         |
|   - sos_events (id, user_id, tier, duress_invoked, tracking_token)            |
|   - community_reports (id, category, lat, lng, description, status)           |
|   - route_feedback (id, perceived_safety_rating, actual_lighting_rating)      |
+-------------------------------------------------------------------------------+
```

---

## Environment Configuration

Create a local environment file named `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL pooled connection string | `postgresql://user:pass@ep-pooler.aws.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | Neon unpooled connection string (for migrations) | `postgresql://user:pass@ep.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | Secret key for JWT session encryption | `your-secure-random-32-character-secret` |
| `NEXT_PUBLIC_APP_URL` | Base canonical domain of the application | `http://localhost:3000` or production URL |

*Security Note: Never commit `.env.local` to public source control. The repository `.gitignore` explicitly blocks all local environment files.*

---

## Local Development Setup

### 1. Web Application

```bash
# Clone the repository
git clone https://github.com/ignitegap/Safie.git
cd Safie

# Install npm dependencies
npm install

# Run database migrations
npm run db:migrate

# Start local Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Android Mobile Application

The Android project is self-contained in the `android/` directory:

```bash
cd android

# Compile and package debug build
./gradlew assembleDebug

# Output APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## API Documentation

| Method | Endpoint | Description | Payload / Query |
|---|---|---|---|
| `GET` | `/api/routes` | Calculates dual walking routes with Night Activity Scores | `?origin=DLF+Cyber+City&destination=Sector+29&city=gurugram` |
| `GET` | `/api/safe-havens` | Returns all 28 verified physical sanctuaries | `?city=all` or `?city=gurugram` |
| `POST` | `/api/reports` | Persists a community hazard or dark spot report | `{ category, lat, lng, address, description }` |
| `GET` | `/api/reports` | Retrieves all recent community hazard reports | None |
| `POST` | `/api/feedback` | Records post-journey perceived safety ratings | `{ route_id, perceived_safety_rating, actual_lighting_rating, comments }` |
| `POST` | `/api/sos` | Dispatches emergency alert (handles covert duress) | `{ lat, lng, tier, duress_invoked }` |
| `GET` | `/api/health` | Service health status and Neon DB connection check | None |

---

## Android Sideloading Specifications

* Package Name: `com.safie.app`
* Version: `1.0.0-delhi` (Version Code `104`)
* Binary Size: `7.9 MB` (`7,904,408 bytes`)
* SHA-256 Checksum: `2cf5f54c77d62fe327292c9c5473414bad9ca5b177ec6143e0726d5739e0cc47`

To install on an Android device:
1. Download the APK file directly to the device.
2. Allow installation from unknown sources in Android Settings.
3. Open `safie-v1.0.0-delhi-ncr.apk` and complete installation.

---

## Competition Slide Deck Reference

A complete, 8-slide presentation blueprint matching the official template of **The Corporate Glitch '26 - Builders Hub** is documented in [ppt.md](ppt.md).

---

## Technical Architecture & Specification

A comprehensive technical specification containing all Mermaid sequence diagrams, state machines, entity-relationship models, and routing logic formulas is documented in [architecture.md](architecture.md).

---

## Disclaimer & Ethical Considerations

Safie evaluates observable environmental factors, municipal lighting data, open commercial frontages, and historical street infrastructure. **Environmental indicators are not proof of absolute personal safety.** Safie does not claim to eliminate risk or guarantee harm-free transit; rather, it equips commuters with actionable situational awareness to make well-informed transit decisions. Emergency SOS services are designed to augment, not replace, local civic emergency dispatch services (such as ERSS 112 in India).

---

## License

This project is licensed under the Apache License 2.0.

