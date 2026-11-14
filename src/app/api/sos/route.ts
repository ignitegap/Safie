import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, phone, lat, lng, tier, duressInvoked } = body;

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Coordinates lat/lng are required' }, { status: 400 });
    }

    const trackingToken = Math.random().toString(36).substring(2, 12);
    const trackingUrl = `https://safie.live/t/${trackingToken}`;

    const event = await db.logSOSEvent({
      userId,
      phone,
      lat: Number(lat),
      lng: Number(lng),
      tier: tier || 3,
      duressInvoked: !!duressInvoked,
      status: 'active',
      trackingToken,
    });

    // Mock SMS / Gateway Dispatch
    console.log(`[SOS-DISPATCH] Emergency Triggered! Tier ${tier}, Duress: ${duressInvoked}`);
    console.log(`[SOS-SMS-SENT] Tracking Link: ${trackingUrl} to Emergency Contacts & 112 Gateway`);

    return NextResponse.json({
      success: true,
      message: duressInvoked
        ? 'Stealth Duress protocol executed. Fake cancel sent to screen, silent distress active.'
        : 'Emergency SOS activated. Emergency contacts and 112 protocol initiated.',
      trackingUrl,
      event,
    });
  } catch (err: any) {
    console.error('[API-SOS-Error]', err);
    return NextResponse.json({ error: 'Failed to process SOS trigger' }, { status: 500 });
  }
}
