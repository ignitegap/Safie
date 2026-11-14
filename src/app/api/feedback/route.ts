import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const res = await query(
      `SELECT id, user_id, route_id, origin, destination, perceived_safety_rating, actual_lighting_rating, comments, created_at 
       FROM route_feedback 
       ORDER BY created_at DESC 
       LIMIT 50`
    );
    return NextResponse.json({
      success: true,
      feedback: res.rows || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      routeId,
      origin,
      destination,
      perceivedSafetyRating,
      actualLightingRating,
      comments,
    } = body;

    if (!perceivedSafetyRating || !actualLightingRating) {
      return NextResponse.json(
        { error: 'Missing required ratings (perceivedSafetyRating, actualLightingRating)' },
        { status: 400 }
      );
    }

    const feedbackId = 'fb_' + crypto.randomBytes(8).toString('hex');

    const res = await query(
      `INSERT INTO route_feedback (id, user_id, route_id, origin, destination, perceived_safety_rating, actual_lighting_rating, comments, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [
        feedbackId,
        userId || null,
        routeId || 'route_default',
        origin || null,
        destination || null,
        perceivedSafetyRating,
        actualLightingRating,
        comments || null,
      ]
    );

    return NextResponse.json({
      success: true,
      feedback: res.rows[0],
      message: 'Route feedback recorded successfully on Neon PostgreSQL.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to record feedback' }, { status: 500 });
  }
}

