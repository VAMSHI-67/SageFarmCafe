import { NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/auth';

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || 'sage2026';

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    if (!timingSafeEqualStrings(password, adminPassword)) {
      return NextResponse.json({ error: 'Invalid administrator passcode' }, { status: 401 });
    }

    await createAdminSession();

    return NextResponse.json({ success: true, message: 'Authentication successful' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
