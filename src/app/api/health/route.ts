import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isNeonConfigured = db.isConfigured();
  const pingResult = await db.ping();

  return NextResponse.json({
    status: 'healthy',
    app: 'Safie Urban Safety Intelligence Platform',
    version: '1.0.0',
    database: {
      type: pingResult.connected
        ? 'Neon Serverless PostgreSQL (Active Live Connection)'
        : 'Resilient Hybrid Store (Fallback)',
      configured: isNeonConfigured,
      liveConnected: pingResult.connected,
      endpoint: 'ep-twilight-darkness-azlrnihd-pooler.c-3.ap-southeast-1.aws.neon.tech',
      latencyMs: pingResult.latencyMs,
      error: pingResult.error || db.getLastError(),
    },
    routingEngine: 'Valhalla C++ Dynamic Costing Profile Active',
    targetCities: ['Delhi', 'Gurugram'],
    timestamp: new Date().toISOString(),
  });
}
