# Safie Urban Safety Intelligence Platform - System Architecture & Logic Specification

## Document Overview
This document specifies the end-to-end engineering architecture, algorithmic logic, data models, state machines, and sequence protocols governing the **Safie Urban Safety Intelligence Platform**.

---

## 1. High-Level System Architecture

Safie employs a modular, event-driven architecture designed to operate across high-density urban environments, intermittent connectivity zones, and physical sanctuary infrastructure.

```mermaid
flowchart TD
    subgraph Client_Layer["Client Presentation Layer"]
        A1["Next.js 14 Web PWA<br/>Responsive Desktop & Mobile"]
        A2["Native Android Client<br/>Kotlin, Jetpack Compose"]
        A3["Interactive Phone Simulator<br/>In-Browser Sandbox"]
    end

    subgraph Edge_Security["API Gateway & Security Layer"]
        B1["Edge Middleware & Auth<br/>JWT & Session Verification"]
        B2["Rate Limiting & DDOS Filter<br/>Token Bucket Engine"]
        B3["Consent & Privacy Router<br/>DPDP 2025 Compliance"]
    end

    subgraph Core_Engines["Safie Core Processing Engines"]
        C1["Pedestrian Routing Engine<br/>Multi-Objective Valhalla & OSRM"]
        C2["Threat Escalation Manager<br/>Dead Man's Switch & Duress PIN"]
        C3["Urban Intelligence Engine<br/>Street Support Index (SSI) Calculator"]
        C4["Temporal Activity Engine<br/>Nocturnal Drop Curve Modeler"]
        C5["Guardian Circle Manager<br/>Live Breadcrumb & Uneasy Dispatch"]
        C6["BLE Mesh Relay Protocol<br/>Offline Zero-Data Flood Hops"]
    end

    subgraph Data_Layer["Persistent Storage & Telemetry"]
        D1["Neon Serverless PostgreSQL<br/>Pooled Primary Spatial DB"]
        D2["PostGIS Extension<br/>Spatial Indexing & ST Geometry"]
        D3["Municipal CCMS Ingestion Cache<br/>Streetlight Sensor Feeds"]
        D4["Community Audit Ledger<br/>Crowdsourced Hazards & Verifications"]
    end

    subgraph External_Integrations["External Gateways & Dispatch"]
        E1["National ERSS 112 Gateway<br/>Emergency Response Dispatch"]
        E2["OpenStreetMap Nominatim<br/>Geocoding & Reverse Coordinates"]
        E3["Emergency SMS & WhatsApp Relay<br/>Twilio & Web Share API"]
        E4["Ask for Angela Physical Network<br/>28 Curated 24/7 Sanctuaries"]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B1

    B1 --> C1
    B1 --> C2
    B1 --> C3
    B1 --> C5

    C1 --> D2
    C1 --> D3
    C2 --> E1
    C2 --> E3
    C3 --> D4
    C4 --> D3
    C5 --> D1
    C5 --> E3
    C6 --> A2
    C1 --> E4
```

---

## 2. Multi-Objective Pedestrian Routing Engine Logic

### 2.1 The Routing Problem
Conventional navigation engines (e.g., Google Maps) solve for the shortest path $\min \sum d_i$ or minimum estimated travel time $\min \sum t_i$. For pedestrian safety at night, shortest paths frequently lead through unlit service roads, desolate flyover underpasses, and blind alleys.

Safie models pedestrian route selection as a **Multi-Objective Cost Minimization Problem** with an explicit safety detour bound:

$$\min_{R \in \mathcal{P}} \left[ \alpha \cdot \text{Time}(R) + \beta \cdot \text{Distance}(R) + \gamma \cdot \text{Penalty}_{\text{Dark}}(R) - \lambda \cdot \text{Support}_{\text{Infrastructure}}(R) \right]$$

Subject to the hard constraint:
$$\text{Time}(R) \le \text{Time}(R_{\text{fastest}}) + \Delta_{\max}$$
Where $\Delta_{\max} = 2.5\text{ minutes}$ (maximum allowable detour penalty for personal safety).

### 2.2 Cost Function Weights
* $\alpha = 0.30$: Temporal transit coefficient.
* $\beta = 0.10$: Physical distance coefficient.
* $\gamma = 0.40$: Darkness and isolated alley avoidance penalty.
* $\lambda = 0.20$: Proximity to active 24/7 havens, smart streetlights, and police kiosks.

### 2.3 Route Personalities
1. **Best-Supported Safe Route (Emerald)**:
   * Prioritizes contiguous GMDA CCMS smart streetlight coverage ($>90\%$).
   * Anchors to within $150\text{m}$ of at least 3 certified 24/7 havens.
   * Eliminates unclassified blind back-alleys entirely.
2. **Balanced Route (Cobalt Blue)**:
   * Balances overall travel duration with well-trafficked collector roads.
   * Requires $\ge 75\%$ lighting coverage.
3. **Direct Shortcut (Alert Red)**:
   * Minimizes physical meters traveled, displaying explicit warning banners regarding unlit segments and absent commercial frontages.

```mermaid
sequenceDiagram
    autonumber
    actor User as Pedestrian Commuter
    participant Web as Safie Web / Android App
    participant API as /api/routes Engine
    participant OSM as OSRM Pedestrian Router
    participant Neon as Neon PostGIS DB
    participant CCMS as GMDA Lighting Telemetry

    User->>Web: Input Origin & Destination (e.g., Cyber Hub -> Sec 29)
    Web->>API: GET /api/routes?origin=...&destination=...&city=gurugram
    API->>OSM: Request Candidate Geometries (Polyline Decoders)
    OSM-->>API: Return Candidate Routes [R1, R2, R3]
    
    API->>Neon: Query Safe Havens within 300m buffer (ST_DWithin)
    Neon-->>API: Return 24/7 Sanctuaries along corridor
    
    API->>CCMS: Ingest Lighting State (Poles, CCMS Illumination %)
    CCMS-->>API: Return Streetlight Status per Segment
    
    API->>API: Compute Street Support Index (SSI) & Penalty Scores
    API-->>Web: Return 3 Personalities (Best-Supported, Balanced, Direct)
    Web->>User: Render Interactive Map with Route Explanations
```

---

## 3. Threat Escalation & Dead Man's Switch State Machine

Safie equips commuters with a 4-tier graduated escalation engine that eliminates the friction of unlocking a smartphone during sudden physical coercion.

```mermaid
stateDiagram-v2
    [*] --> Tier0_MonitoredWalk : App Open & Route Active
    
    Tier0_MonitoredWalk --> Tier1_SafetyHold : User presses and holds thumb on switch
    Tier1_SafetyHold --> Tier0_MonitoredWalk : Cancel hold without threat
    
    Tier1_SafetyHold --> Tier2_HoldReleased : Thumb released from screen
    
    state Tier2_HoldReleased {
        [*] --> Countdown_10s : Initiate 10s Haptic Window
        Countdown_10s --> VerifyPIN : User enters 4-digit PIN
        
        VerifyPIN --> Disarmed : PIN == 1234 (Normal PIN)
        VerifyPIN --> DeceptiveCancel : PIN == 9876 (Covert Duress PIN)
        
        Countdown_10s --> TimerExpired : 00:00 Reached without PIN
    }
    
    Disarmed --> Tier0_MonitoredWalk : System Returns to Normal
    DeceptiveCancel --> Tier3_EmergencySOS : Display "Alarm Cancelled" to Attacker + Silent Police SOS
    TimerExpired --> Tier3_EmergencySOS : Automatic Escalation
    
    state Tier3_EmergencySOS {
        [*] --> Dispatch112 : Dispatch Encrypted Packet to Police 112
        [*] --> BroadcastGuardian : Accelerate GPS Ping to 5s & Notify Circle
        [*] --> OfflineMesh : Initiate BLE Flood if Cellular Offline
    }
```

### 3.1 Covert Duress Logic (PIN 9876)
* When an attacker coerces a victim to cancel the sounding alarm, entering the normal PIN (`1234`) cleanly aborts the alert.
* Entering the **Covert Duress PIN (`9876`)** triggers a psychological deception protocol:
  1. The smartphone UI transitions to a calm green "Alarm Cancelled / All Clear" screen.
  2. The speaker and haptic actuators fall completely silent.
  3. In the background, an encrypted JSON payload is transmitted via `/api/sos` marked `duress_invoked: true`, pinning the user's exact latitude, longitude, movement speed, and heading to the National Emergency Response Support System (ERSS 112) and registered family guardians.

---

## 4. Live GPS Walking Companion & Anomaly Detection Logic

During an active walk, the client executes a continuous telemetry loop using the HTML5 Geolocation API (`watchPosition`) or native Android LocationManager (`FusedLocationProviderClient`).

```mermaid
flowchart TD
    StartGPS["watchPosition(coords, heading, speed)"] --> CalcDist["Calculate Distance to Active Route Polyline"]
    
    CalcDist --> CheckDev{"Distance > 50 meters?"}
    CheckDev -- Yes --> TriggerDevAlert["Trigger Off-Route Deviation Alert<br/>Audio Cue + Visual Banner"]
    TriggerDevAlert --> FindHaven["Query Nearest Safe Haven (ST_Distance)"]
    FindHaven --> RerouteCTA["Display 1-Tap Reroute to Refuge"]
    CheckDev -- No --> CheckSpeed{"Speed < 0.5 km/h for > 3 mins?"}
    
    CheckSpeed -- Yes --> TriggerStationary["Trigger Unexpected Stop Alert<br/>Display 'Are you okay?' Dialog"]
    TriggerStationary --> UserResponse{"User Response?"}
    UserResponse -- "I'm OK (PIN/Tap)" --> ResetTimer["Reset Stationary Monitor"]
    UserResponse -- "No Response in 30s" --> EscalateHold["Auto-Trigger Tier 2 Countdown"]
    UserResponse -- "Trigger SOS" --> InstantSOS["Direct Dispatch to 112"]
    
    CheckSpeed -- No --> NormalWalk["Maintain Active Walk Beacon (30s Ping)"]
    ResetTimer --> NormalWalk
```

---

## 5. Guardian Circle & Offline BLE Mesh Protocol

### 5.1 Guardian Circle Telemetry Tiers
* **Passive Monitoring**: Standard location ping interval is set to $30\text{ seconds}$ to preserve device battery.
* **"I'm Feeling Uneasy" Mode**:
  * Triggered by a single tap from the commuter.
  * Accelerates ping frequency from $30\text{s}$ down to $5\text{ seconds}$.
  * Transmits high-priority mobile push notifications to primary guardians with live GPS tracking links.
  * Avoids firing loud sirens or summoning police vans prematurely, allowing the commuter to navigate low-level discomfort without public embarrassment.

### 5.2 Zero-Data BLE Mesh Flood Relay
In subterranean parking facilities, basements, or cellular network blackouts, Safie relies on peer-to-peer Bluetooth Low Energy (BLE) multi-hop packet routing.

```mermaid
sequenceDiagram
    autonumber
    actor Victim as Distressed Commuter (No Cellular Data)
    participant NodeA as Nearby Phone A (12m away)
    participant NodeB as Nearby Phone B (45m away)
    participant Cell as Cellular 5G Tower
    participant Portal as Safie Police Dispatch Gateway (112)

    Victim->>Victim: SOS Triggered (Hold Expired or PIN 9876)
    Note over Victim: Cellular & Wi-Fi Offline
    Victim->>NodeA: Broadcast Encrypted BLE SOS Packet (Hop 1, TTL=5)
    Note over NodeA: Inspects TTL > 0, Re-broadcasts
    NodeA->>NodeB: Forward BLE Packet (Hop 2, TTL=4)
    Note over NodeB: Device has Active 5G Connection
    NodeB->>Cell: Uplink SOS Packet to Safie Cloud via HTTPS
    Cell->>Portal: Ingest Telemetry (Victim ID, Lat/Lng, Timestamp)
    Portal-->>Victim: Confirmation Packet Flooded Back to Phone
```

---

## 6. Public Street Lighting & Safety Survey Engine (Street Support Index)

### 6.1 Epistemological Framework
Safie strictly avoids declaring a road "safe" or "unsafe." Safety is an unobservable latent state influenced by non-deterministic social factors. Safie instead computes the **Street Support Index (SSI)**, a calibrated $0-100$ measure of observable environmental indicators.

### 6.2 SSI Formula & Pillars
The Street Support Index $S_{\text{ssi}}(t)$ for a corridor at time $t$ is calculated across four observable pillars:

$$S_{\text{ssi}}(t) = 0.35 \cdot L(t) + 0.25 \cdot A(t) + 0.20 \cdot S_{\text{sec}}(t) + 0.20 \cdot P_{\text{infra}}$$

Where:
* $L(t)$: Observable Streetlight Illumination ($\%$ of functioning CCMS fixtures and high-mast poles).
* $A(t)$: Commercial Frontage & Pedestrian Activity (count of verified open shops, cafes, and pedestrian density at time $t$).
* $S_{\text{sec}}(t)$: Formal Security Presence (active police kiosks, PCR patrol vans, visible CCTV, and private guards).
* $P_{\text{infra}}$: Physical Pedestrian Infrastructure (raised sidewalks, continuous paved walkways, absence of construction barriers).

### 6.3 Temporal Nocturnal Activity Curve
Corridor scores are time-dependent. Street activity declines sharply between dusk and dawn:

```
Score (SSI)
100 |     * (18:00 - Dusk Peak, 96/100)
 90 |       \
 80 |         * (21:00 - Transit Peak, 90/100)
 70 |           \
 60 |             * (23:30 - Late Night, 84/100)
 50 |               \
 40 |                 * (02:00 - Midnight Drop, 64/100)
 30 |                   \
 20 |                     * (04:30 - Dawn Transit, 72/100)
  0 +--------------------------------------------------- Time
```

---

## 7. Database Entity-Relationship Model (Neon PostgreSQL + PostGIS)

```mermaid
erDiagram
    USERS ||--o{ EMERGENCY_CONTACTS : registers
    USERS ||--o{ SOS_EVENTS : triggers
    USERS ||--o{ COMMUNITY_REPORTS : submits
    USERS ||--o{ ROUTE_FEEDBACK : provides
    
    USERS {
        uuid id PK
        string full_name
        string phone_number UK
        string hashed_password
        string duress_pin_hash
        boolean is_active
        timestamp created_at
    }

    EMERGENCY_CONTACTS {
        uuid id PK
        uuid user_id FK
        string contact_name
        string contact_phone
        string relationship
        boolean notify_on_uneasy
        boolean notify_on_sos
    }

    SAFE_HAVENS {
        uuid id PK
        string name
        string address
        string category
        float latitude
        float longitude
        string contact_phone
        boolean is_24_hours
        boolean angela_protocol_certified
        geography location_geom
    }

    ROAD_SEGMENTS {
        string segment_id PK
        string corridor_name
        string zone
        float base_ssi_score
        float lighting_percentage
        integer smart_poles_count
        integer cctv_count
        integer pcr_kiosks_count
        integer safe_havens_count
        geography segment_geom
        timestamp last_audited_at
    }

    COMMUNITY_REPORTS {
        uuid id PK
        uuid user_id FK
        string category
        string street_address
        text description
        float latitude
        float longitude
        boolean photo_attached
        string verification_status
        timestamp created_at
    }

    ROUTE_FEEDBACK {
        uuid id PK
        uuid user_id FK
        string origin_address
        string destination_address
        integer perceived_safety_rating
        integer actual_lighting_rating
        text comments
        timestamp created_at
    }

    SOS_EVENTS {
        uuid id PK
        uuid user_id FK
        integer tier_level
        boolean duress_invoked
        float latitude
        float longitude
        string status
        timestamp dispatched_at
    }
```

---

## 8. Physical Sanctuary Protocol ("Ask for Angela")

Digital alerts depend on having a physical safe space to retreat to. Safie certifies 24/7 pharmacies, transit stations, and hospitals as designated safe refuges.

```mermaid
sequenceDiagram
    autonumber
    actor User as Pedestrian Commuter
    participant Ref as Certified Refuge Staff (e.g. Apollo 24/7)
    participant CCTV as CCTV & Access Control
    participant Police as Local Police (PCR Van)

    User->>User: Identifies pursuer on street
    User->>Ref: Enters store and uses Codeword: "Can I speak with Angela?"
    Ref->>Ref: Staff recognizes protocol immediately
    Ref->>User: Discreetly escorts commuter behind counter into employee room
    Ref->>CCTV: Verifies outside entrance under CCTV recording
    Ref->>User: Offers phone charging, water, and locked door security
    Ref->>Police: Calls designated police liaison or summons verified cab
    Police->>Ref: PCR arrives on scene to escort commuter safely home
```

---

## 9. Security, Cryptography & Privacy Specifications

1. **At-Rest Encryption**: All citizen mobile numbers, emergency contacts, and GPS telemetry are encrypted in Neon PostgreSQL using AES-256.
2. **In-Transit Encryption**: All API traffic strictly requires TLS 1.3 with HSTS headers.
3. **Duress PIN Protection**: Normal PINs (`1234`) and Duress PINs (`9876`) are hashed using individual salted bcrypt rounds. The client never transmits the raw PIN over the network; only signed JWT tokens containing verification status are processed.
4. **Data Retention Policy (DPDP 2025 Compliance)**:
   * Commuter GPS breadcrumbs during active navigation are held in memory buffers and purged 2 hours after trip conclusion.
   * Only aggregate, anonymized hazard observations and street ratings are retained for municipal infrastructure analysis.
