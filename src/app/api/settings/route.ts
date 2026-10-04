import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

// Public GET: Cafe settings & info
export async function GET() {
  try {
    const db = getDb();
    const res = await db.execute('SELECT * FROM cafe_info WHERE id = 1');
    return NextResponse.json({ info: res.rows[0] || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin PATCH: Update Cafe settings
export async function PATCH(req: Request) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      tagline,
      description,
      address,
      phone1,
      phone2,
      email,
      opening_hours,
      google_maps_url,
      instagram_url,
    } = body;

    const db = getDb();
    const existingRes = await db.execute('SELECT * FROM cafe_info WHERE id = 1');
    const existing = existingRes.rows[0] as any;
    if (!existing) {
      return NextResponse.json({ error: 'Cafe settings not found' }, { status: 404 });
    }

    const updatedName = name !== undefined ? name.trim() : existing.name;
    const updatedTagline = tagline !== undefined ? tagline.trim() : existing.tagline;
    const updatedDesc = description !== undefined ? description.trim() : existing.description;
    const updatedAddress = address !== undefined ? address.trim() : existing.address;
    const updatedPhone1 = phone1 !== undefined ? phone1.trim() : existing.phone1;
    const updatedPhone2 = phone2 !== undefined ? phone2.trim() : existing.phone2;
    const updatedEmail = email !== undefined ? email.trim() : existing.email;
    const updatedHours = opening_hours !== undefined ? opening_hours.trim() : existing.opening_hours;
    const updatedMaps = google_maps_url !== undefined ? google_maps_url.trim() : existing.google_maps_url;
    const updatedInsta = instagram_url !== undefined ? instagram_url.trim() : existing.instagram_url;

    if (!updatedName || !updatedAddress || !updatedPhone1 || !updatedHours) {
      return NextResponse.json({ error: 'Name, address, primary phone, and opening hours are required.' }, { status: 400 });
    }

    await db.execute({
      sql: `
        UPDATE cafe_info
        SET name = ?,
            tagline = ?,
            description = ?,
            address = ?,
            phone1 = ?,
            phone2 = ?,
            email = ?,
            opening_hours = ?,
            google_maps_url = ?,
            instagram_url = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `,
      args: [
        updatedName,
        updatedTagline,
        updatedDesc,
        updatedAddress,
        updatedPhone1,
        updatedPhone2,
        updatedEmail,
        updatedHours,
        updatedMaps,
        updatedInsta
      ]
    });

    const updated = await db.execute('SELECT * FROM cafe_info WHERE id = 1');
    return NextResponse.json({ success: true, info: updated.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
