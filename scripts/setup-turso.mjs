import { createClient } from '@libsql/client';
import path from 'path';

// Script to initialize and seed database tables for Turso cloud or local libSQL file
async function setupDatabase() {
  const url = process.env.TURSO_DATABASE_URL || `file:${path.join(process.cwd(), 'sage_cafe.db')}`;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log(`Connecting to database at: ${url}`);
  const client = createClient({ url, authToken });

  console.log('Creating database tables...');

  // 1. Cafe Information
  await client.execute(`
    CREATE TABLE IF NOT EXISTS cafe_info (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      address TEXT NOT NULL,
      phone1 TEXT NOT NULL,
      phone2 TEXT,
      email TEXT,
      opening_hours TEXT NOT NULL,
      google_maps_url TEXT,
      instagram_url TEXT,
      max_party_size INTEGER DEFAULT 12,
      slot_duration_minutes INTEGER DEFAULT 90,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Menu Categories
  await client.execute(`
    CREATE TABLE IF NOT EXISTS menu_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Menu Items
  await client.execute(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      is_veg INTEGER DEFAULT 1,
      is_vegan INTEGER DEFAULT 0,
      is_gluten_free INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      is_available INTEGER DEFAULT 1,
      image_url TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE
    );
  `);

  // 4. Gallery Images
  await client.execute(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      caption TEXT,
      image_url TEXT NOT NULL,
      category TEXT DEFAULT 'ambience',
      featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Tables initialized. Checking initial seed...');

  // Seed cafe_info if empty
  const infoRes = await client.execute('SELECT COUNT(*) as count FROM cafe_info');
  const infoCount = (infoRes.rows[0] as any)?.count || 0;
  if (infoCount === 0) {
    await client.execute({
      sql: `
        INSERT INTO cafe_info (id, name, tagline, description, address, phone1, phone2, email, opening_hours, google_maps_url, instagram_url)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        'Sage Farm Cafe',
        'Banjara Hills, Hyderabad • Farm-To-Fork',
        'Where slow-fermented 48-hour sourdoughs, unadulterated organic harvests from Sage Organics, and single-estate Araku coffees meet in a sun-dappled courtyard.',
        'Plot 1299/A, Road No. 65, Jubilee Hills / Banjara Hills, Hyderabad, Telangana 500033',
        '+91 91000 73505',
        '+91 40 2355 7777',
        'hello@sagefarmcafe.in',
        'Tue – Sun: 8:00 AM – 10:30 PM (Mondays Closed for farm harvest)',
        'https://maps.google.com/?q=Sage+Farm+Cafe+Hyderabad',
        'https://instagram.com/sagefarmcafe'
      ]
    });
    console.log('Seeded cafe_info successfully.');
  }

  // Seed categories if empty
  const catRes = await client.execute('SELECT COUNT(*) as count FROM menu_categories');
  const catCount = (catRes.rows[0] as any)?.count || 0;
  if (catCount === 0) {
    await client.execute(`
      INSERT INTO menu_categories (name, slug, description, display_order, is_active) VALUES
      ('Artisan Sourdough & Toasts', 'sourdough-toasts', '48-hour cold fermented wild sourdough baked fresh daily with organic stoneground flours', 1, 1),
      ('Farm Salads & Harvest Bowls', 'salads-bowls', 'Fresh crisp organic greens from Sage Organics farm, hand-harvested daily at dawn', 2, 1),
      ('Small Plates & Grazing', 'small-plates', 'Artisanal cheese pairings, warm dips, and small farm sharing plates', 3, 1),
      ('Large Plates & Woodfired', 'large-plates', 'Handmade pastas, roasted seasonal gourds, and comforting farm-to-fork mains', 4, 1),
      ('Desserts & Bakes', 'desserts-bakes', 'Refined sugar-free, conscious confections sweetened with raw palm jaggery and organic wild honey', 5, 1),
      ('Araku Coffee & Botanicals', 'coffee-drinks', 'Single-estate tribal Araku valley shade-grown arabica and cold-pressed botanical elixirs', 6, 1);
    `);
    console.log('Seeded menu_categories.');
  }

  console.log('Database setup and verification complete!');
}

setupDatabase().catch(console.error);
