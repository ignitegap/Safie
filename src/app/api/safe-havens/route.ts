import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Haversine formula to compute distance in metres
function calculateDistanceMetres(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userLat = parseFloat(searchParams.get('lat') || '');
    const userLng = parseFloat(searchParams.get('lng') || '');
    const category = searchParams.get('category');

    let havens = await db.getSafeHavens();

    if (category && category !== 'all') {
      havens = havens.filter((h) => h.category === category);
    }

    if (!isNaN(userLat) && !isNaN(userLng)) {
      havens = havens.map((h) => ({
        ...h,
        distanceMetres: calculateDistanceMetres(userLat, userLng, h.lat, h.lng),
      })).sort((a: any, b: any) => a.distanceMetres - b.distanceMetres);
    }

    return NextResponse.json({
      success: true,
      count: havens.length,
      safeHavens: havens,
    });
  } catch (err: any) {
    console.error('[API-SafeHavens-Error]', err);
    return NextResponse.json({ error: 'Failed to retrieve safe havens' }, { status: 500 });
  }
}
