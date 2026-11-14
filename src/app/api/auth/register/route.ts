import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, name, password, emergencyContacts, duressPin } = body;

    if (!phone || !password || !name) {
      return NextResponse.json(
        { error: 'Phone number, name, and password are required' },
        { status: 400 }
      );
    }

    // Clean phone number (strip whitespace and non-digits except +)
    const cleanedPhone = phone.replace(/[^\d+]/g, '');

    // Check if user already exists
    const existing = await db.getUserByPhone(cleanedPhone);
    if (existing) {
      return NextResponse.json(
        { error: 'User with this phone number already registered' },
        { status: 409 }
      );
    }

    const passwordHash = await auth.hashPassword(password);
    const user = await db.createUser({
      phone: cleanedPhone,
      name: name.trim(),
      passwordHash,
      emergencyContacts: emergencyContacts || [
        { name: 'Emergency Contact 1', phone: '+91-9811001122', relation: 'Family' },
      ],
      duressPin: duressPin || '9876',
    });

    const token = auth.generateToken({
      userId: user.id,
      phone: user.phone,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
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
    console.error('[API-Register-Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
