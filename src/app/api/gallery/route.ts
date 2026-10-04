import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

// Public GET: Gallery images
export async function GET() {
  try {
    const db = getDb();
    const res = await db.execute('SELECT * FROM gallery_images ORDER BY display_order ASC, id DESC');
    return NextResponse.json({ images: res.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin POST: Add gallery image
export async function POST(req: Request) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { title, caption, image_url, category, featured, display_order } = body;

    if (!image_url || !title) {
      return NextResponse.json({ error: 'Title and Image URL are required.' }, { status: 400 });
    }

    // Basic URL format validation
    if (!image_url.startsWith('http://') && !image_url.startsWith('https://') && !image_url.startsWith('/')) {
      return NextResponse.json({ error: 'Please enter a valid image URL (e.g. https://...)' }, { status: 400 });
    }

    const db = getDb();
    const info = await db.execute({
      sql: `
        INSERT INTO gallery_images (title, caption, image_url, category, featured, display_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        title.trim(),
        caption ? caption.trim() : '',
        image_url.trim(),
        category || 'ambience',
        featured ? 1 : 0,
        parseInt(display_order) || 0
      ]
    });

    const created = await db.execute({
      sql: 'SELECT * FROM gallery_images WHERE id = ?',
      args: [info.lastInsertRowid || 0]
    });
    return NextResponse.json({ success: true, image: created.rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin PATCH: Edit gallery image
export async function PATCH(req: Request) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, caption, image_url, category, featured, display_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing image ID' }, { status: 400 });
    }

    const db = getDb();
    const existingRes = await db.execute({
      sql: 'SELECT * FROM gallery_images WHERE id = ?',
      args: [id]
    });
    const existing = existingRes.rows[0] as any;
    if (!existing) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const updatedTitle = title !== undefined ? title.trim() : existing.title;
    const updatedCaption = caption !== undefined ? caption.trim() : existing.caption;
    const updatedUrl = image_url !== undefined ? image_url.trim() : existing.image_url;
    const updatedCategory = category !== undefined ? category : existing.category;
    const updatedFeatured = featured !== undefined ? (featured ? 1 : 0) : existing.featured;
    const updatedOrder = display_order !== undefined ? parseInt(display_order) : existing.display_order;

    if (!updatedTitle || !updatedUrl) {
      return NextResponse.json({ error: 'Title and Image URL cannot be empty' }, { status: 400 });
    }

    await db.execute({
      sql: `
        UPDATE gallery_images
        SET title = ?, caption = ?, image_url = ?, category = ?, featured = ?, display_order = ?
        WHERE id = ?
      `,
      args: [
        updatedTitle,
        updatedCaption,
        updatedUrl,
        updatedCategory,
        updatedFeatured,
        updatedOrder,
        id
      ]
    });

    const updated = await db.execute({
      sql: 'SELECT * FROM gallery_images WHERE id = ?',
      args: [id]
    });
    return NextResponse.json({ success: true, image: updated.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin DELETE: Delete gallery image
export async function DELETE(req: Request) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const db = getDb();
    const existing = await db.execute({
      sql: 'SELECT * FROM gallery_images WHERE id = ?',
      args: [id]
    });
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await db.execute({
      sql: 'DELETE FROM gallery_images WHERE id = ?',
      args: [id]
    });
    return NextResponse.json({ success: true, message: 'Image deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
