import { MapPin, Phone, Clock, Heart, Globe } from 'lucide-react';

interface FooterProps {
  cafeInfo?: {
    name?: string;
    description?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    email?: string;
    opening_hours?: string;
    instagram_url?: string;
    google_maps_url?: string;
  };
}

export default function Footer({ cafeInfo }: FooterProps) {
  const name = cafeInfo?.name || 'SAGE FARM CAFE';
  const desc = cafeInfo?.description || 'Wholesome farm-to-table dining and living space rooted in organic soil, artisanal baking, and seasonal simplicity in Hyderabad.';
  const address = cafeInfo?.address || 'Plot No. 1227, Road No. 12, MLA Colony, Banjara Hills / Jubilee Hills, Hyderabad 500034';
  const phone1 = cafeInfo?.phone1 || '+91 99666 43073';
  const phone2 = cafeInfo?.phone2 || '+91 91777 91199';
  const hours = cafeInfo?.opening_hours || '10:30 AM – 10:30 PM';
  const insta = cafeInfo?.instagram_url || 'https://www.instagram.com/sagefarmcafe';
  const maps = cafeInfo?.google_maps_url || 'https://www.google.com/maps?q=sage+farm+cafe+hyderabad';

  return (
    <footer className="bg-[#0E1B14] text-earth-linen border-t border-[#1C271D] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-clay-500 text-earth-surface flex items-center justify-center font-serif font-bold text-base">
                S
              </div>
              <span className="font-serif text-xl tracking-wider text-earth-surface font-bold uppercase">
                {name}
              </span>
            </div>
            <p className="text-sage-300 text-xs sm:text-sm leading-relaxed">
              {desc}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={insta}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sage-300 hover:text-earth-surface hover:bg-clay-500 transition-colors"
                aria-label="Instagram"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={maps}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sage-300 hover:text-earth-surface hover:bg-clay-500 transition-colors"
                aria-label="Google Maps"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-earth-surface font-serif text-base tracking-wide border-b border-white/10 pb-2">
              Showcase Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-sage-300">
              <li><a href="#story" className="hover:text-clay-400 transition-colors">Our Story & Farm</a></li>
              <li><a href="#menu" className="hover:text-clay-400 transition-colors">Artisanal Menu</a></li>
              <li><a href="#gallery" className="hover:text-clay-400 transition-colors">Visual Gallery</a></li>
              <li><a href="#visit" className="hover:text-clay-400 transition-colors">Location & Timings</a></li>
            </ul>
          </div>

          {/* Timings & Opening */}
          <div className="space-y-3">
            <h4 className="text-earth-surface font-serif text-base tracking-wide border-b border-white/10 pb-2">
              Hours & Service
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-sage-300">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-clay-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-earth-surface">Monday to Sunday</p>
                  <p>{hours}</p>
                </div>
              </div>
              <p className="text-xs text-sage-400 pt-2">
                * Walk-ins welcome daily. Pet-friendly courtyard seating available.
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-earth-surface font-serif text-base tracking-wide border-b border-white/10 pb-2">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-sage-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-clay-400 mt-0.5 shrink-0" />
                <span>{address}</span>
              </div>
              {phone1 && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-clay-400 shrink-0" />
                  <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="hover:text-clay-300">{phone1}</a>
                </div>
              )}
              {phone2 && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-clay-400 shrink-0" />
                  <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="hover:text-clay-300">{phone2}</a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sage-400 gap-4">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-sage-400">
              Cultivated with <Heart className="w-3.5 h-3.5 text-clay-500 fill-clay-500" /> for Hyderabad
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
