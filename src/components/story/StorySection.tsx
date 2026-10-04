'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sprout, Wheat, Coffee, HeartHandshake, Sparkles, MapPin } from 'lucide-react';
import SectionAtmosphere from '@/components/decorative/SectionAtmosphere';

export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Subtle natural parallax offsets
  const yImage1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yImage2 = useTransform(scrollYProgress, [0, 1], [70, -60]);
  const yCard = useTransform(scrollYProgress, [0, 1], [30, -20]);

  const pillars = [
    {
      icon: Sprout,
      title: 'Our Organic Farm',
      desc: 'Partnered directly with Sage Organics, harvesting zero-chemical greens, heirloom varieties, and native botanicals at sunrise for daily service.',
    },
    {
      icon: Wheat,
      title: '48-Hour Slow Sourdough',
      desc: 'Our artisanal bakery crafts slow-fermented, wild-yeast sourdoughs and focaccias with zero industrial additives or commercial yeast.',
    },
    {
      icon: Coffee,
      title: 'Single-Estate Shade Arabica',
      desc: 'Directly sourced from indigenous growers in Araku Valley, roasted with precision, and poured fresh to celebrate nuanced terroir.',
    },
    {
      icon: HeartHandshake,
      title: 'Conscious Living Space',
      desc: 'More than a cafe—a quiet sanctuary amidst Jubilee Hills and Banjara Hills where nature, mindful conversations, and clean food converge.',
    },
  ];

  return (
    <section
      id="story"
      ref={containerRef}
      className="py-32 bg-[#EDF1E6] relative overflow-hidden transition-colors border-t border-[#DED7C8]/70"
    >
      {/* Background Ambience & Botanical Motifs */}
      <SectionAtmosphere variant="softsage" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Spatial Multi-Depth Photography Installation */}
          <div className="lg:col-span-6 relative">
            <div className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center">

              {/* Primary Main Physical Photo Frame */}
              <motion.div
                style={{ y: yImage1 }}
                className="relative z-10 w-4/5 sm:w-3/4 rounded-3xl overflow-hidden shadow-xl border-4 border-[#FFFCF5] bg-sage-900"
              >
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop"
                  alt="Sage Farm Organic Harvesting"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-earth-surface">
                  <p className="text-[10px] uppercase tracking-widest text-clay-300 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Hyderabad Organic Harvest
                  </p>
                  <p className="text-sm font-serif font-medium mt-0.5">
                    Cultivated naturally in living soil
                  </p>
                </div>
              </motion.div>

              {/* Offset Spatial Secondary Photo (Baking / Craft) */}
              <motion.div
                style={{ y: yImage2 }}
                className="absolute top-4 -right-2 sm:-right-4 z-20 w-1/2 rounded-2xl overflow-hidden shadow-xl border-4 border-[#FFFCF5] bg-[#FFFCF5] hidden sm:block"
              >
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop"
                  alt="Wood-Fired Wild Sourdough"
                  className="w-full h-44 object-cover"
                />
                <div className="p-3 bg-[#FFFCF5]">
                  <p className="text-[9px] uppercase font-bold text-clay-500 tracking-wider">
                    Wild Yeast Bakes
                  </p>
                  <p className="text-xs text-earth-primary font-serif font-bold">
                    48-Hr Slow Ferment
                  </p>
                </div>
              </motion.div>

              {/* Tactile Signature Badge */}
              <motion.div
                style={{ y: yCard }}
                className="absolute -bottom-6 -left-2 sm:-left-4 z-30 bg-[#FFFCF5]/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-[#DED7C8] max-w-xs"
              >
                <div className="flex items-center gap-2 text-clay-500 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Living Philosophy
                  </span>
                </div>
                <p className="font-serif font-bold text-earth-primary text-base leading-snug">
                  "Real food begins in honest, living soil."
                </p>
                <p className="text-[11px] text-earth-secondary mt-1">
                  Rooted in Hyderabad's conscious dining movement.
                </p>
              </motion.div>

            </div>
          </div>

          {/* Editorial Narrative & Pillars */}
          <div className="lg:col-span-6 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFCF5] border border-[#DED7C8] mb-3 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-clay-500" />
                <span className="text-clay-600 uppercase tracking-widest text-[10px] font-bold">
                  Origins & Soil
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-earth-primary leading-tight">
                Honoring the rhythm of the soil, the hand, and the table.
              </h2>
            </div>

            <p className="text-earth-secondary text-sm sm:text-base leading-relaxed">
              Sage Farm Cafe was born out of a quiet conviction: that the purest dining experiences are those closest to the earth. In an era of ultra-processed convenience, we cultivate our own organic produce, mill heritage grains, and practice slow food traditions in Hyderabad.
            </p>

            {/* Farm / Feature Cards (Tactile #FFFCF5 Material Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {pillars.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#FFFCF5] border border-[#DED7C8] hover:border-clay-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center text-clay-500 mb-3 shadow-inner">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-earth-primary">
                    {item.title}
                  </h4>
                  <p className="text-xs text-earth-secondary mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
