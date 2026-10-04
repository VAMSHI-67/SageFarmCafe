import { MapPin, Clock, Navigation, Car } from 'lucide-react';
import SectionAtmosphere from '@/components/decorative/SectionAtmosphere';

interface VisitSectionProps {
  cafeInfo?: {
    name?: string;
    address?: string;
    opening_hours?: string;
    google_maps_url?: string;
  };
}

export default function VisitSection({ cafeInfo }: VisitSectionProps) {
  const address = cafeInfo?.address || 'Plot No. 1227, Road No. 12, MLA Colony, Banjara Hills / Jubilee Hills, Hyderabad, Telangana 500034, India';
  const hours = cafeInfo?.opening_hours || 'Monday to Sunday: 10:30 AM – 10:30 PM (Kitchen closes at 10:00 PM)';
  const maps = cafeInfo?.google_maps_url || 'https://www.google.com/maps?q=sage+farm+cafe+hyderabad';

  return (
    <section id="visit" className="py-28 bg-[#F7F2E7] relative overflow-hidden border-t border-[#DED7C8]/70">
      {/* Background Section Atmosphere */}
      <SectionAtmosphere variant="sage" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Info Card */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFCF5] border border-[#DED7C8] text-clay-600 text-[10px] font-bold uppercase tracking-widest mb-3 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-clay-500" />
                Find Us in Hyderabad
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-earth-primary">
                Visit Sage Farm Cafe
              </h2>
              <p className="text-earth-secondary text-sm sm:text-base mt-3 leading-relaxed">
                Tucked into the serene leafy bylanes of MLA Colony, Banjara Hills / Jubilee Hills. Step into a breezy open-air courtyard and artisanal bakery space.
              </p>
            </div>

            {/* Core Details in #FFFCF5 Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFCF5] border border-[#DED7C8] shadow-xs hover:shadow-md hover:border-clay-400 transition-all">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-clay-500 shrink-0 shadow-inner">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-earth-primary">Location Address</h4>
                  <p className="text-xs sm:text-sm text-earth-secondary mt-1 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFCF5] border border-[#DED7C8] shadow-xs hover:shadow-md hover:border-clay-400 transition-all">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-clay-500 shrink-0 shadow-inner">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-earth-primary">Operating Timings</h4>
                  <p className="text-xs sm:text-sm text-earth-secondary mt-1 leading-relaxed">
                    {hours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFCF5] border border-[#DED7C8] shadow-xs hover:shadow-md hover:border-clay-400 transition-all">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-clay-500 shrink-0 shadow-inner">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-earth-primary">Parking & Amenities</h4>
                  <p className="text-xs sm:text-sm text-earth-secondary mt-1 leading-relaxed">
                    Valet assistance available, pet-friendly garden dining, wheelchair-accessible pathways.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Google Maps Button */}
            <div className="pt-2">
              <a
                href={maps}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-clay-500 hover:bg-clay-600 text-earth-surface font-semibold text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Navigation className="w-4 h-4 text-earth-linen" />
                Get Directions on Google Maps
              </a>
            </div>
          </div>

          {/* Interactive Map Embed with Warm Frame */}
          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-[#FFFCF5] h-96 lg:h-[480px] relative bg-sage-100">
            <iframe
              title="Sage Farm Cafe Google Maps Location"
              src="https://maps.google.com/maps?q=Sage%20Farm%20Cafe%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 grayscale-[15%] contrast-[1.05]"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
