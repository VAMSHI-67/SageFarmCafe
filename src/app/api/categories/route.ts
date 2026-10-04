import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

// Public GET categories
export async function GET() {
  try {
    const db = getDb();
    const res = await db.execute('SELECT * FROM menu_categories ORDER BY display_order ASC, id ASC');
    return NextResponse.json({ categories: res.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin POST: Add Category
export async function POST(req: Request) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, display_order, is_active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const categorySlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const db = getDb();
    const info = await db.execute({
      sql: `
        INSERT INTO menu_categories (name, slug, description, display_order, is_active)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        name.trim(),
        categorySlug,
        description ? description.trim() : '',
        parseInt(display_order) || 0,
        is_active !== undefined ? (is_active ? 1 : 0) : 1
      ],
    });

    const createdRes = await db.execute({
      sql: 'SELECT * FROM menu_categories WHERE id = ?',
      args: [info.lastInsertRowid || 0],
    });

    return NextResponse.json({ success: true, category: createdRes.rows[0] }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'A category with this slug or name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin PATCH: Update Category
export async function PATCH(req: Request) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, slug, description, display_order, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    const db = getDb();
    const existingRes = await db.execute({
      sql: 'SELECT * FROM menu_categories WHERE id = ?',
      args: [id],
    });
    const existing = existingRes.rows[0] as any;
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updatedName = name !== undefined ? name.trim() : existing.name;
    const updatedSlug = slug !== undefined ? slug.trim() : existing.slug;
    const updatedDesc = description !== undefined ? description.trim() : existing.description;
    const dispOrder = display_order !== undefined ? parseInt(display_order) : existing.display_order;
    const active = is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active;

    await db.execute({
      sql: `
        UPDATE menu_categories
        SET name = ?, slug = ?, description = ?, display_order = ?, is_active = ?
        WHERE id = ?
      `,
      args: [updatedName, updatedSlug, updatedDesc, dispOrder, active, id],
    });

    const updatedRes = await db.execute({
      sql: 'SELECT * FROM menu_categories WHERE id = ?',
      args: [id],
    });
    return NextResponse.json({ success: true, category: updatedRes.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin DELETE: Safe category deletion/deactivation
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
    const existingRes = await db.execute({
      sql: 'SELECT * FROM menu_categories WHERE id = ?',
      args: [id],
    });
    if (existingRes.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category has associated dishes
    const countRes = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM menu_items WHERE category_id = ?',
      args: [id],
    });
    const count = (countRes.rows[0] as any)?.count || 0;

    if (count > 0) {
      // Soft disable rather than breaking active dishes
      await db.execute({
        sql: 'UPDATE menu_categories SET is_active = 0 WHERE id = ?',
        args: [id],
      });
      return NextResponse.json({
        success: true,
        deactivated: true,
        message: `Category contains ${count} items. Disabled safely instead of deleting.`
      });
    }

    await db.execute({
      sql: 'DELETE FROM menu_categories WHERE id = ?',
      args: [id],
    });
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
