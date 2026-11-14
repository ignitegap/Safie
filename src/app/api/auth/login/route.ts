import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Phone number and password are required' },
        { status: 400 }
      );
    }

    const cleanedPhone = phone.replace(/[^\d+]/g, '');
    const user = await db.getUserByPhone(cleanedPhone);

    if (!user) {
      return NextResponse.json(
        { error: 'No user registered with this phone number' },
        { status: 404 }
      );
    }

    const isValid = await auth.comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password entered' },
        { status: 401 }
      );
    }

    const token = auth.generateToken({
      userId: user.id,
      phone: user.phone,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        emergencyContacts: user.emergencyContacts,
        duressPin: user.duressPin,
      },
    });
  } catch (err: any) {
    console.error('[API-Login-Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
