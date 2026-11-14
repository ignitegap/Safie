import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const res = await query(
      `SELECT id, user_id, category, lat, lng, address, description, status, created_at 
       FROM community_reports 
       ORDER BY created_at DESC 
       LIMIT 50`
    );
    return NextResponse.json({
      success: true,
      reports: res.rows || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, lat, lng, address, description, userId } = body;

    if (!category || !lat || !lng || !description) {
      return NextResponse.json(
        { error: 'Missing required report fields (category, lat, lng, description)' },
        { status: 400 }
      );
    }

    const reportId = 'rep_' + crypto.randomBytes(8).toString('hex');

    const res = await query(
      `INSERT INTO community_reports (id, user_id, category, lat, lng, address, description, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'submitted', NOW())
       RETURNING *`,
      [reportId, userId || null, category, lat, lng, address || null, description]
    );

    return NextResponse.json({
      success: true,
      report: res.rows[0],
      message: 'Community street hazard report registered successfully on Neon PostgreSQL.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit report' }, { status: 500 });
  }
}
