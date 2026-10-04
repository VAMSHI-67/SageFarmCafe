import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

// Public GET: categories with items (for website) or all items for admin
export async function GET() {
  try {
    const db = getDb();
    const [catRes, itemRes] = await Promise.all([
      db.execute('SELECT * FROM menu_categories ORDER BY display_order ASC, id ASC'),
      db.execute('SELECT * FROM menu_items ORDER BY id ASC'),
    ]);

    const categories = catRes.rows as any[];
    const items = itemRes.rows as any[];

    const structured = categories.map((cat) => ({
      ...cat,
      items: items.filter((item) => item.category_id === cat.id),
    }));

    return NextResponse.json({ categories: structured, items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin POST: Add Menu Item
export async function POST(req: Request) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      category_id,
      name,
      description,
      price,
      is_veg,
      is_vegan,
      is_gluten_free,
      is_bestseller,
      is_available,
      image_url,
      tags
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: 'Valid positive price is required' }, { status: 400 });
    }
    const catId = parseInt(category_id);
    if (isNaN(catId)) {
      return NextResponse.json({ error: 'Valid category is required' }, { status: 400 });
    }

    const db = getDb();
    const categoryExists = await db.execute({
      sql: 'SELECT id FROM menu_categories WHERE id = ?',
      args: [catId],
    });
    if (categoryExists.rows.length === 0) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 400 });
    }

    const info = await db.execute({
      sql: `
        INSERT INTO menu_items (
          category_id, name, description, price, is_veg, is_vegan, is_gluten_free, is_bestseller, is_available, image_url, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        catId,
        name.trim(),
        description ? description.trim() : '',
        numericPrice,
        is_veg !== undefined ? (is_veg ? 1 : 0) : 1,
        is_vegan ? 1 : 0,
        is_gluten_free ? 1 : 0,
        is_bestseller ? 1 : 0,
        is_available !== undefined ? (is_available ? 1 : 0) : 1,
        image_url ? image_url.trim() : '',
        tags ? tags.trim() : ''
      ],
    });

    const createdRes = await db.execute({
      sql: 'SELECT * FROM menu_items WHERE id = ?',
      args: [info.lastInsertRowid || 0],
    });

    return NextResponse.json({ success: true, item: createdRes.rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin PATCH: Edit Menu Item
export async function PATCH(req: Request) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      category_id,
      name,
      description,
      price,
      is_veg,
      is_vegan,
      is_gluten_free,
      is_bestseller,
      is_available,
      image_url,
      tags
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }

    const db = getDb();
    const existingRes = await db.execute({
      sql: 'SELECT * FROM menu_items WHERE id = ?',
      args: [id],
    });
    const existing = existingRes.rows[0] as any;
    if (!existing) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const updatedName = name !== undefined ? name.trim() : existing.name;
    const updatedDesc = description !== undefined ? description.trim() : existing.description;
    const updatedPrice = price !== undefined ? parseFloat(price) : existing.price;
    const updatedCatId = category_id !== undefined ? parseInt(category_id) : existing.category_id;
    const updatedVeg = is_veg !== undefined ? (is_veg ? 1 : 0) : existing.is_veg;
    const updatedVegan = is_vegan !== undefined ? (is_vegan ? 1 : 0) : existing.is_vegan;
    const updatedGf = is_gluten_free !== undefined ? (is_gluten_free ? 1 : 0) : existing.is_gluten_free;
    const updatedBestseller = is_bestseller !== undefined ? (is_bestseller ? 1 : 0) : existing.is_bestseller;
    const updatedAvailable = is_available !== undefined ? (is_available ? 1 : 0) : existing.is_available;
    const updatedImage = image_url !== undefined ? image_url.trim() : existing.image_url;
    const updatedTags = tags !== undefined ? tags.trim() : existing.tags;

    if (!updatedName) {
      return NextResponse.json({ error: 'Item name cannot be empty' }, { status: 400 });
    }
    if (isNaN(updatedPrice) || updatedPrice <= 0) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
    }

    await db.execute({
      sql: `
        UPDATE menu_items
        SET category_id = ?,
            name = ?,
            description = ?,
            price = ?,
            is_veg = ?,
            is_vegan = ?,
            is_gluten_free = ?,
            is_bestseller = ?,
            is_available = ?,
            image_url = ?,
            tags = ?
        WHERE id = ?
      `,
      args: [
        updatedCatId,
        updatedName,
        updatedDesc,
        updatedPrice,
        updatedVeg,
        updatedVegan,
        updatedGf,
        updatedBestseller,
        updatedAvailable,
        updatedImage,
        updatedTags,
        id
      ],
    });

    const updatedRes = await db.execute({
      sql: 'SELECT * FROM menu_items WHERE id = ?',
      args: [id],
    });
    return NextResponse.json({ success: true, item: updatedRes.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Protected Admin DELETE: Delete Menu Item
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
      sql: 'SELECT * FROM menu_items WHERE id = ?',
      args: [id],
    });
    if (existingRes.rows.length === 0) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    await db.execute({
      sql: 'DELETE FROM menu_items WHERE id = ?',
      args: [id],
    });
    return NextResponse.json({ success: true, message: 'Menu item deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
