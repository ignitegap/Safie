import { NextResponse } from 'next/server';
import { SAMPLE_ROUTE_CANDIDATES, GURUGRAM_ROAD_SEGMENTS } from '@/lib/data-delhi-ncr';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get('origin') || 'DLF Cyber City';
    const destination = searchParams.get('destination') || 'Sector 29 Market';

    return NextResponse.json({
      success: true,
      query: { origin, destination },
      routes: SAMPLE_ROUTE_CANDIDATES,
      evaluatedSegments: GURUGRAM_ROAD_SEGMENTS,
      meta: {
        lightingEngine: 'GMDA CCMS SCADA Connected',
        pedestrianCosting: 'Valhalla C++ Dynamic Costing Profile',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to calculate routes' }, { status: 500 });
  }
}
