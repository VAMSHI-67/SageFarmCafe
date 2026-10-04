export interface CafeInfo {
  id: number;
  name: string;
  tagline?: string;
  description?: string;
  address: string;
  phone1: string;
  phone2?: string;
  email?: string;
  opening_hours: string;
  google_maps_url?: string;
  instagram_url?: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  is_veg: number;
  is_vegan: number;
  is_gluten_free: number;
  is_bestseller: number;
  is_available: number;
  image_url?: string;
  tags?: string;
  catName?: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: number;
  display_order: number;
  items?: MenuItem[];
}

export interface GalleryImage {
  id: number;
  title: string;
  caption?: string;
  image_url: string;
  category: string;
  featured: number;
  display_order: number;
}
