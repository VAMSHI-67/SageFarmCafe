'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Camera } from 'lucide-react';
import SectionAtmosphere from '@/components/decorative/SectionAtmosphere';
import { GalleryImage } from '@/types';

type GalleryItem = GalleryImage;

export default function GallerySection({ images }: { images: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Perspectives' },
    { id: 'ambience', label: 'Lush Ambience' },
    { id: 'food', label: 'Farm Plates' },
    { id: 'drinks', label: 'Brew & Tonics' },
  ];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter((img) => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-28 bg-[#F7F2E7] relative overflow-hidden border-t border-[#DED7C8]/70">
      {/* Background Ambience & Botanical Motifs */}
      <SectionAtmosphere variant="linen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFCF5] border border-[#DED7C8] mb-3 shadow-xs">
            <Camera className="w-3.5 h-3.5 text-clay-500" />
            <span className="text-clay-600 uppercase tracking-widest text-[10px] font-bold">
              Visual Ambiance
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-earth-primary font-bold">
            Glimpses of Sage Farm Cafe
          </h2>
          <p className="text-earth-secondary text-sm sm:text-base mt-3 leading-relaxed">
            Sun-dappled foliage, earthy stone flooring, hand-crafted artisanal ceramics, and honest organic cuisine in Banjara Hills.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-sage-800 text-earth-surface shadow-md scale-105'
                  : 'bg-[#FFFCF5] text-earth-secondary border border-[#DED7C8] hover:bg-sage-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid with Controlled Variation & Warm Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setActiveImage(img)}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md bg-sage-200 border-4 border-[#FFFCF5]"
            >
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-earth-surface">
                <span className="text-[10px] uppercase tracking-widest text-clay-300 font-bold">
                  {img.category}
                </span>
                <h4 className="font-serif text-lg font-bold mt-1 text-earth-surface">
                  {img.title}
                </h4>
                <p className="text-xs text-sage-200 mt-1 line-clamp-2">
                  {img.caption}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-clay-300 font-medium">
                  <Eye className="w-3.5 h-3.5" /> View Fullscreen
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImage(null)}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-[#FFFCF5] rounded-3xl overflow-hidden shadow-2xl border border-[#DED7C8]"
              >
                <button
                  onClick={() => setActiveImage(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="h-[55vh] sm:h-[65vh] w-full bg-black">
                  <img
                    src={activeImage.image_url}
                    alt={activeImage.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6 bg-[#FFFCF5]">
                  <span className="text-[10px] uppercase tracking-wider text-clay-500 font-bold">
                    {activeImage.category}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-earth-primary mt-1">
                    {activeImage.title}
                  </h3>
                  <p className="text-sm text-earth-secondary mt-2">
                    {activeImage.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
