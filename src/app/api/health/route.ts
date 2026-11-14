import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const isNeon = db.isConfigured();
  return NextResponse.json({
    status: 'healthy',
    app: 'Safie Urban Safety Intelligence Platform',
    version: '1.0.0',
    database: {
      type: isNeon ? 'Neon Serverless PostgreSQL (PostGIS)' : 'Resilient Hybrid Local Mode',
      connected: isNeon,
      project: 'noisy-shadow-23252383',
      organization: 'org-wandering-pond-44280358',
    },
    routingEngine: 'Valhalla C++ Dynamic Costing Profile Active',
    targetCities: ['Delhi', 'Gurugram'],
    timestamp: new Date().toISOString(),
  });
}
