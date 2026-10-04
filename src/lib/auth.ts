import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'sage_admin_session';
const SESSION_DURATION_HOURS = 12;

function getSecretKey(): string {
  return process.env.SESSION_SECRET || 'sage_farm_default_fallback_secret_key_prod_2026';
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

// Compute Web Crypto HMAC SHA-256 signature
async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  return base64UrlEncode(signatureBuffer);
}

// Constant-time string equality check
function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function signSessionPayload(payload: object): Promise<string> {
  const json = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const base64 = base64UrlEncode(encoder.encode(json));
  const signature = await createSignature(base64, getSecretKey());
  return `${base64}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<any | null> {
  if (!token || !token.includes('.')) return null;
  const [base64, signature] = token.split('.');
  if (!base64 || !signature) return null;

  try {
    const expectedSig = await createSignature(base64, getSecretKey());
    if (timingSafeEqualStrings(signature, expectedSig)) {
      const decodedJson = base64UrlDecode(base64);
      const payload = JSON.parse(decodedJson);
      if (payload.exp && Date.now() > payload.exp) {
        return null; // Expired
      }
      return payload;
    }
  } catch {
    return null;
  }

  return null;
}

export async function createAdminSession(): Promise<string> {
  const exp = Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000;
  const payload = {
    role: 'ADMIN',
    authenticated: true,
    exp,
  };
  const token = await signSessionPayload(payload);

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_HOURS * 3600,
  });

  return token;
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return !!(payload && payload.role === 'ADMIN');
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
