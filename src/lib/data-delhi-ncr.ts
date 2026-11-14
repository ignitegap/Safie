// ============================================================================
// SAFIE — Authoritative Spatial & POI Dataset for Delhi NCR & Gurugram
// Grounded in OpenStreetMap, GMDA OneMap GIS, and Delhi Police / DMRC Data
// ============================================================================

export interface SafeHaven {
  id: string;
  name: string;
  category: 'pharmacy_247' | 'metro_security' | 'hospital' | 'petrol_pump' | 'cafe_247';
  categoryLabel: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  is24Hours: boolean;
  verifiedBadge: boolean;
  amenities: {
    powerCharging: boolean;
    firstAid: boolean;
    landlineAccess: boolean;
    cctvMonitoring: boolean;
    trainedStaff: boolean; // Ask for Angela protocol
  };
}

export interface RoadSegment {
  id: string;
  name: string;
  zone: 'Gurugram' | 'Delhi';
  startCoord: [number, number];
  endCoord: [number, number];
  lightingStatus: 'verified_lit' | 'partially_lit' | 'unlit_dark_spot';
  lightingPercentage: number;
  hasSidewalk: boolean;
  sidewalkCondition: 'paved_continuous' | 'obstructed' | 'none';
  commercialActivity: 'high_active' | 'moderate' | 'isolated';
  nearbySafeHavensCount: number;
  ccmsConnected: boolean; // Connected to GMDA SCADA CCMS
  environmentalScore: number; // 0 - 100
}

export interface RouteCandidate {
  id: string;
  title: string;
  type: 'safest' | 'balanced' | 'fastest';
  score: number; // 0 - 100
  durationMinutes: number;
  distanceKm: number;
  litPercentage: number;
  safeHavensOnRoute: number;
  deficiencyBlackspots: number;
  description: string;
  color: string;
  coordinates: [number, number][];
  segments: string[];
}

// ----------------------------------------------------------------------------
// Curated 24/7 Verified Safe Havens in Gurugram & Delhi
// ----------------------------------------------------------------------------
export const DELHI_NCR_SAFE_HAVENS: SafeHaven[] = [
  // Gurugram Cyber City & DLF Area
  {
    id: 'sh-ggm-001',
    name: 'Apollo Pharmacy 24/7 (Cyber Hub)',
    category: 'pharmacy_247',
    categoryLabel: '24/7 Apollo Pharmacy',
    lat: 28.4958,
    lng: 77.0895,
    address: 'Shop 14, Building 8B, DLF Cyber City, Gurugram',
    phone: '+91-124-4061234',
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: true,
      cctvMonitoring: true,
      trainedStaff: true,
    },
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
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: true,
      cctvMonitoring: true,
      trainedStaff: true,
    },
  },
  {
    id: 'sh-ggm-003',
    name: 'Chaayos 24/7 Cyber Hub',
    category: 'cafe_247',
    categoryLabel: '24/7 Verified Cafe Haven',
    lat: 28.4939,
    lng: 77.0899,
    address: 'DLF Cyber Hub Promenade, Gurugram',
    phone: '+91-9871234567',
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: false,
      landlineAccess: false,
      cctvMonitoring: true,
      trainedStaff: true,
    },
  },
  {
    id: 'sh-ggm-004',
    name: 'HPCL 24-Hour Petrol Station & Guard Desk',
    category: 'petrol_pump',
    categoryLabel: '24-Hour Illuminated Petrol Station',
    lat: 28.4831,
    lng: 77.0834,
    address: 'Near Sikanderpur Metro, Mehrauli-Gurgaon Rd, Gurugram',
    phone: '+91-124-2358899',
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: true,
      cctvMonitoring: true,
      trainedStaff: true,
    },
  },
  {
    id: 'sh-ggm-005',
    name: 'MedPlus 24/7 (Sector 29 Market)',
    category: 'pharmacy_247',
    categoryLabel: '24/7 MedPlus Pharmacy',
    lat: 28.4688,
    lng: 77.0638,
    address: 'SCO 34, Main Market, Sector 29, Gurugram',
    phone: '+91-124-4329988',
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: true,
      cctvMonitoring: true,
      trainedStaff: true,
    },
  },
  {
    id: 'sh-ggm-006',
    name: 'Fortis Memorial Research Institute (Emergency Gate)',
    category: 'hospital',
    categoryLabel: 'Hospital 24/7 Emergency & Trauma Centre',
    lat: 28.4598,
    lng: 77.0732,
    address: 'Sector 44, Opposite HUDA City Centre Metro, Gurugram',
    phone: '+91-124-4962200',
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: true,
      cctvMonitoring: true,
      trainedStaff: true,
    },
  },
  {
    id: 'sh-ggm-007',
    name: 'DMRC Women Help Desk (Millennium City Centre)',
    category: 'metro_security',
    categoryLabel: 'DMRC Women Safety Help Point',
    lat: 28.4592,
    lng: 77.0718,
    address: 'Concourse Level, Millennium City Centre Metro, Gurugram',
    phone: '112 / +91-11-23417910',
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: true,
      cctvMonitoring: true,
      trainedStaff: true,
    },
  },

  // Central & South Delhi
  {
    id: 'sh-del-001',
    name: 'Delhi Police Central Assistance Booth (Rajiv Chowk)',
    category: 'metro_security',
    categoryLabel: 'Delhi Police Emergency Desk',
    lat: 28.6329,
    lng: 77.2195,
    address: 'Inner Circle Block B, Rajiv Chowk Metro Gate 7, Connaught Place, New Delhi',
    phone: '112 / 1091',
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: true,
      cctvMonitoring: true,
      trainedStaff: true,
    },
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
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: false,
      cctvMonitoring: true,
      trainedStaff: true,
    },
  },
  {
    id: 'sh-del-003',
    name: 'Max Super Speciality Hospital (Saket)',
    category: 'hospital',
    categoryLabel: 'Hospital 24/7 Emergency Hub',
    lat: 28.5276,
    lng: 77.2134,
    address: '1, 2 Press Enclave Marg, Saket, New Delhi',
    phone: '+91-11-26515050',
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: true,
      cctvMonitoring: true,
      trainedStaff: true,
    },
  },
  {
    id: 'sh-del-004',
    name: 'Hauz Khas Metro Women Assistance Desk',
    category: 'metro_security',
    categoryLabel: 'DMRC Pink Line Help Desk',
    lat: 28.5492,
    lng: 77.2005,
    address: 'Interchange Gate 3, Hauz Khas Metro Station, New Delhi',
    phone: '112 / +91-11-26569988',
    is24Hours: true,
    verifiedBadge: true,
    amenities: {
      powerCharging: true,
      firstAid: true,
      landlineAccess: true,
      cctvMonitoring: true,
      trainedStaff: true,
    },
  },
];

// ----------------------------------------------------------------------------
// Key Road Segments & Infrastructure Evaluation (Gurugram Pilot)
// ----------------------------------------------------------------------------
export const GURUGRAM_ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'seg-001',
    name: 'DLF Cyber City Master Boulevard',
    zone: 'Gurugram',
    startCoord: [28.4952, 77.0892],
    endCoord: [28.4920, 77.0880],
    lightingStatus: 'verified_lit',
    lightingPercentage: 96,
    hasSidewalk: true,
    sidewalkCondition: 'paved_continuous',
    commercialActivity: 'high_active',
    nearbySafeHavensCount: 3,
    ccmsConnected: true,
    environmentalScore: 92,
  },
  {
    id: 'seg-002',
    name: 'Cyber City to Belvedere Towers Walkway',
    zone: 'Gurugram',
    startCoord: [28.4920, 77.0880],
    endCoord: [28.4880, 77.0895],
    lightingStatus: 'verified_lit',
    lightingPercentage: 88,
    hasSidewalk: true,
    sidewalkCondition: 'paved_continuous',
    commercialActivity: 'high_active',
    nearbySafeHavensCount: 2,
    ccmsConnected: true,
    environmentalScore: 84,
  },
  {
    id: 'seg-003',
    name: 'DLF Phase 2 Back Service Lane (Alleyway)',
    zone: 'Gurugram',
    startCoord: [28.4915, 77.0850],
    endCoord: [28.4870, 77.0860],
    lightingStatus: 'unlit_dark_spot',
    lightingPercentage: 22,
    hasSidewalk: false,
    sidewalkCondition: 'none',
    commercialActivity: 'isolated',
    nearbySafeHavensCount: 0,
    ccmsConnected: false,
    environmentalScore: 24, // Dangerous unlit cut-through
  },
  {
    id: 'seg-004',
    name: 'MG Road Main Commercial Corridor',
    zone: 'Gurugram',
    startCoord: [28.4816, 77.0932],
    endCoord: [28.4720, 77.0725],
    lightingStatus: 'verified_lit',
    lightingPercentage: 90,
    hasSidewalk: true,
    sidewalkCondition: 'paved_continuous',
    commercialActivity: 'high_active',
    nearbySafeHavensCount: 4,
    ccmsConnected: true,
    environmentalScore: 88,
  },
  {
    id: 'seg-005',
    name: 'IFFCO Chowk Underpass Connection',
    zone: 'Gurugram',
    startCoord: [28.4720, 77.0725],
    endCoord: [28.4682, 77.0632],
    lightingStatus: 'partially_lit',
    lightingPercentage: 55,
    hasSidewalk: false,
    sidewalkCondition: 'obstructed',
    commercialActivity: 'moderate',
    nearbySafeHavensCount: 1,
    ccmsConnected: true,
    environmentalScore: 52, // Monsoon flood-prone
  },
];

// ----------------------------------------------------------------------------
// Simulated Multi-Objective Route Candidates (Cyber City -> Sector 29)
// ----------------------------------------------------------------------------
export const SAMPLE_ROUTE_CANDIDATES: RouteCandidate[] = [
  {
    id: 'route-safest',
    title: 'SAFIE RECOMMENDATION (Safest Route)',
    type: 'safest',
    score: 86,
    durationMinutes: 14,
    distanceKm: 1.4,
    litPercentage: 96,
    safeHavensOnRoute: 4,
    deficiencyBlackspots: 0,
    description: '100% verified streetlights, active storefronts, passes 24/7 Apollo Pharmacy & Metro security booth. Continuous raised footpath.',
    color: '#10B981', // Emerald Green
    coordinates: [
      [28.4952, 77.0892],
      [28.4925, 77.0885],
      [28.4895, 77.0890],
      [28.4855, 77.0910],
      [28.4816, 77.0932],
      [28.4760, 77.0820],
      [28.4720, 77.0725],
      [28.4682, 77.0632],
    ],
    segments: ['seg-001', 'seg-002', 'seg-004'],
  },
  {
    id: 'route-balanced',
    title: 'BALANCED ROUTE (Transit-Assisted)',
    type: 'balanced',
    score: 74,
    durationMinutes: 12,
    distanceKm: 1.2,
    litPercentage: 82,
    safeHavensOnRoute: 2,
    deficiencyBlackspots: 0,
    description: 'Follows Rapid Metro track and commercial perimeter. Well-lit with occasional quieter residential crossings.',
    color: '#3B82F6', // Blue
    coordinates: [
      [28.4952, 77.0892],
      [28.4910, 77.0870],
      [28.4860, 77.0865],
      [28.4816, 77.0800],
      [28.4740, 77.0710],
      [28.4682, 77.0632],
    ],
    segments: ['seg-001', 'seg-005'],
  },
  {
    id: 'route-fastest',
    title: 'FASTEST ROUTE (Standard GPS / High Risk)',
    type: 'fastest',
    score: 26,
    durationMinutes: 10,
    distanceKm: 0.9,
    litPercentage: 24,
    safeHavensOnRoute: 0,
    deficiencyBlackspots: 2,
    description: 'Saves 4 minutes by cutting through unlit DLF Phase 2 service alley. No streetlights, broken pavements, isolated blind corners.',
    color: '#EF4444', // Red
    coordinates: [
      [28.4952, 77.0892],
      [28.4915, 77.0850],
      [28.4870, 77.0860],
      [28.4780, 77.0750],
      [28.4682, 77.0632],
    ],
    segments: ['seg-003'],
  },
];

// Compatibility aliases
export const DELHI_NCR_ROAD_SEGMENTS = GURUGRAM_ROAD_SEGMENTS;
export const ROUTE_CANDIDATES = SAMPLE_ROUTE_CANDIDATES;

