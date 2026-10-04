import { getDb } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroScene from '@/components/3d/HeroScene';
import BotanicalBackground from '@/components/3d/BotanicalBackground';
import StorySection from '@/components/story/StorySection';
import Interactive3DMenu from '@/components/menu/Interactive3DMenu';
import GallerySection from '@/components/gallery/GallerySection';
import VisitSection from '@/components/visit/VisitSection';
import SageLogo from '@/components/brand/SageLogo';
import { Sparkles, ArrowDown, BookOpen, MapPin } from 'lucide-react';
import { CafeInfo, MenuCategory, MenuItem, GalleryImage } from '@/types';

// Force dynamic rendering on server for live database sync
export const dynamic = 'force-dynamic';

async function getCafeData() {
  const db = getDb();

  try {
    const [catRes, itemRes, galRes, infoRes] = await Promise.all([
      db.execute('SELECT * FROM menu_categories WHERE is_active = 1 ORDER BY display_order ASC, id ASC'),
      db.execute('SELECT * FROM menu_items WHERE is_available = 1 ORDER BY id ASC'),
      db.execute('SELECT * FROM gallery_images ORDER BY display_order ASC, id DESC'),
      db.execute('SELECT * FROM cafe_info WHERE id = 1'),
    ]);

    // Explicitly convert libSQL row representations into plain serializable JavaScript objects
    const rawCategories = catRes.rows || [];
    const rawItems = itemRes.rows || [];
    const rawGallery = galRes.rows || [];
    const rawInfo = infoRes.rows[0] as any || null;

    const items: MenuItem[] = rawItems.map((row: any) => ({
      id: Number(row.id),
      category_id: Number(row.category_id),
      name: String(row.name || ''),
      description: row.description ? String(row.description) : '',
      price: Number(row.price || 0),
      is_veg: Number(row.is_veg) ? 1 : 0,
      is_vegan: Number(row.is_vegan) ? 1 : 0,
      is_gluten_free: Number(row.is_gluten_free) ? 1 : 0,
      is_bestseller: Number(row.is_bestseller) ? 1 : 0,
      is_available: Number(row.is_available) ? 1 : 0,
      image_url: row.image_url ? String(row.image_url) : '',
      tags: row.tags ? String(row.tags) : '',
    }));

    const categories: MenuCategory[] = rawCategories.map((row: any) => {
      const catId = Number(row.id);
      return {
        id: catId,
        name: String(row.name || ''),
        slug: String(row.slug || ''),
        description: row.description ? String(row.description) : '',
        is_active: Number(row.is_active) ? 1 : 0,
        display_order: Number(row.display_order || 0),
        items: items.filter((item) => item.category_id === catId),
      };
    });

    const galleryImages: GalleryImage[] = rawGallery.map((row: any) => ({
      id: Number(row.id),
      title: String(row.title || ''),
      caption: row.caption ? String(row.caption) : '',
      image_url: String(row.image_url || ''),
      category: String(row.category || 'ambience'),
      featured: Number(row.featured) ? 1 : 0,
      display_order: Number(row.display_order || 0),
    }));

    const cafeInfo: CafeInfo | null = rawInfo
      ? {
          id: Number(rawInfo.id),
          name: String(rawInfo.name || ''),
          tagline: rawInfo.tagline ? String(rawInfo.tagline) : '',
          description: rawInfo.description ? String(rawInfo.description) : '',
          address: String(rawInfo.address || ''),
          phone1: String(rawInfo.phone1 || ''),
          phone2: rawInfo.phone2 ? String(rawInfo.phone2) : '',
          email: rawInfo.email ? String(rawInfo.email) : '',
          opening_hours: String(rawInfo.opening_hours || ''),
          google_maps_url: rawInfo.google_maps_url ? String(rawInfo.google_maps_url) : '',
          instagram_url: rawInfo.instagram_url ? String(rawInfo.instagram_url) : '',
        }
      : null;

    return {
      categories,
      galleryImages,
      cafeInfo,
    };
  } catch (err) {
    console.error('Failed to fetch cafe data from database:', err);
    return {
      categories: [],
      galleryImages: [],
      cafeInfo: null,
    };
  }
}

export default async function Home() {
  const { categories, galleryImages, cafeInfo } = await getCafeData();

  return (
    <main className="min-h-screen flex flex-col bg-earth-cream selection:bg-sage-200 selection:text-earth-primary relative tactile-paper-texture">
      <Navbar />

      {/* 1. Hero Section with Preserved 3D WebGL Spatial Scene & Botanical Canvas */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-earth-cream pt-24 pb-16">
        {/* Animated Botanical Particles & Organic Vector Patterns in Canvas */}
        <BotanicalBackground />

        {/* Ambient Subtle Glow Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-sage-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-clay-300/15 rounded-full blur-3xl pointer-events-none" />

        {/* 3D WebGL Canvas Layer - Preserved & Interactive */}
        <div className="absolute inset-0 z-0 opacity-85">
          <HeroScene />
        </div>

        {/* Hero Brand Identity & Typography with High Readability Overlay */}
        <div className="relative z-10 text-center pointer-events-none px-4 max-w-4xl mx-auto flex flex-col items-center">
          {/* Authentic Cafe Logo Emblem */}
          <div className="mb-4 pointer-events-auto hover:scale-105 transition-transform duration-500">
            <div className="p-3.5 bg-earth-surface/90 rounded-full border border-earth-border shadow-lg backdrop-blur-md">
              <SageLogo className="w-14 h-14 sm:w-16 sm:h-16" />
            </div>
          </div>

          {/* Eyebrow Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-earth-surface/90 border border-clay-300/60 shadow-xs backdrop-blur-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-clay-500" />
            <span className="text-[10px] sm:xs font-semibold tracking-[0.22em] text-clay-600 uppercase">
              {cafeInfo?.tagline || 'Banjara Hills, Hyderabad • Farm-To-Fork'}
            </span>
          </div>

          {/* Main Editorial Cafe Title */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-earth-primary tracking-tight leading-[1.05] drop-shadow-sm">
            {cafeInfo?.name || 'Sage Farm Cafe'}
          </h1>

          {/* Curated Sensory Subtitle */}
          <p className="text-earth-secondary text-sm sm:text-base md:text-lg mt-5 max-w-2xl mx-auto leading-relaxed font-normal bg-earth-surface/75 backdrop-blur-xs px-4 py-2 rounded-2xl border border-earth-border/50 shadow-xs">
            {cafeInfo?.description || 'Where slow-fermented 48-hour sourdoughs, unadulterated organic harvests from Sage Organics, and single-estate Araku coffees meet in a sun-dappled courtyard.'}
          </p>

          {/* Showcase CTAs: Explore Menu & Visit Us */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
            <a
              href="#menu"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-clay-500 hover:bg-clay-600 text-earth-surface text-xs font-semibold uppercase tracking-[0.15em] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <BookOpen className="w-3.5 h-3.5 text-earth-linen" />
              Explore the Menu
            </a>
            <a
              href="#visit"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-earth-surface hover:bg-earth-linen text-earth-primary border border-earth-border text-xs font-semibold uppercase tracking-[0.15em] shadow-xs hover:shadow-md transition-all duration-300"
            >
              <MapPin className="w-3.5 h-3.5 text-clay-500" />
              Visit Sage Farm Cafe
            </a>
          </div>
        </div>

        {/* Ambient Scroll Guide */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
          <a
            href="#story"
            className="pointer-events-auto inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-earth-secondary font-semibold bg-earth-surface/90 px-4 py-2 rounded-full border border-earth-border backdrop-blur-md shadow-xs hover:bg-earth-linen transition-colors"
          >
            <span>Scroll to Discover</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-clay-500" />
          </a>
        </div>
      </section>

      {/* 2. Story & Organic Origins */}
      <StorySection />

      {/* 3. Interactive Artisan Menu */}
      <Interactive3DMenu categories={categories} />

      {/* 4. Ambiance Photo Exhibition Gallery */}
      <GallerySection images={galleryImages} />

      {/* 5. Visit, Timings & Google Maps */}
      <VisitSection cafeInfo={cafeInfo || undefined} />

      {/* 6. Footer */}
      <Footer cafeInfo={cafeInfo || undefined} />
    </main>
  );
}
