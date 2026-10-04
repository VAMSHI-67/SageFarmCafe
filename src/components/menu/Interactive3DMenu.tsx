'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { CafeInfo, MenuCategory, MenuItem } from '@/types';
import SectionAtmosphere from '@/components/decorative/SectionAtmosphere';

interface Category extends MenuCategory {
  items: MenuItem[];
}

export default function Interactive3DMenu({ categories }: { categories: MenuCategory[] }) {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);

  const currentCategory = categories[activePageIndex] || categories[0];
  const totalPages = categories.length;

  const handleNextPage = () => {
    if (activePageIndex < totalPages - 1) {
      setActivePageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (activePageIndex > 0) {
      setActivePageIndex((prev) => prev - 1);
    }
  };

  return (
    <section id="menu" className="py-28 bg-[#F7F2E7] relative overflow-hidden border-t border-[#DED7C8]/70">
      {/* Background Ambience Motifs */}
      <SectionAtmosphere variant="clay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFCF5] border border-[#DED7C8] mb-3 shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-clay-500" />
            <span className="text-clay-600 uppercase tracking-widest text-[10px] font-bold">
              Farm Harvest To Table
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-earth-primary font-bold">
            The Living Artisanal Menu
          </h2>
          <p className="text-earth-secondary text-sm sm:text-base mt-3 leading-relaxed">
            Crafted from seasonal produce gathered daily from our organic plots. Unprocessed, wild-fermented, and naturally rich in vital nutrients.
          </p>
        </div>

        {/* Physical Menu Table Book Presentation in Espresso Tone Frame */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-[#352820] p-3 sm:p-5 rounded-[2.5rem] shadow-2xl border-4 border-[#251D1A]">

            {/* Menu Open/Closed Toggle Bar */}
            <div className="flex items-center justify-between px-4 py-2 text-earth-linen/80 text-xs border-b border-white/10 mb-3">
              <span className="font-serif tracking-widest uppercase text-[10px] text-clay-300 font-bold">
                Sage Farm Cafe • Printed Table Edition
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-earth-linen text-[11px] transition-colors"
                >
                  {isMenuOpen ? 'Fold Menu' : 'Open Menu'}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="open-menu"
                  initial={{ opacity: 0, rotateX: 8, scale: 0.98 }}
                  animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateX: -8, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#FFFCF5] text-earth-primary rounded-[2rem] p-6 sm:p-10 shadow-xl border border-[#DED7C8] relative overflow-hidden"
                >
                  {/* Subtle Spine Stitching Line */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-sage-200 hidden md:block" />

                  {/* Header within open menu book */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#DED7C8] gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-clay-500">
                          Section {activePageIndex + 1} of {totalPages}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-earth-primary mt-1">
                        {currentCategory?.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-earth-secondary mt-1">
                        {currentCategory?.description}
                      </p>
                    </div>

                    {/* Category Tab Pills in Muted Sage */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-md">
                      {categories.map((cat, idx) => (
                        <button
                          key={cat.id}
                          onClick={() => setActivePageIndex(idx)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            activePageIndex === idx
                              ? 'bg-sage-800 text-earth-surface shadow-xs'
                              : 'bg-[#EDF1E6] text-sage-800 hover:bg-sage-200'
                          }`}
                        >
                          {cat.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Items 2-Column Page Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {currentCategory?.items?.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#FAF7EF] border border-[#DED7C8] hover:border-clay-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div className="flex gap-4">
                          {item.image_url && (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-sage-100 border border-[#DED7C8]">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-serif font-bold text-base text-earth-primary group-hover:text-clay-500 transition-colors">
                                {item.name}
                              </h4>
                              <span className="font-serif font-bold text-base text-earth-primary shrink-0">
                                ₹{item.price}
                              </span>
                            </div>

                            <p className="text-xs text-earth-secondary mt-1.5 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>

                            {/* Dietary Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-3">
                              {item.is_bestseller === 1 && (
                                <span className="bg-clay-100 text-clay-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" /> Signature
                                </span>
                              )}
                              {item.is_vegan === 1 && (
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] px-2 py-0.5 rounded-full font-medium">
                                  Vegan
                                </span>
                              )}
                              {item.is_gluten_free === 1 && (
                                <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 text-[9px] px-2 py-0.5 rounded-full font-medium">
                                  GF
                                </span>
                              )}
                              {item.tags?.split(',').map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-sage-100 text-sage-800 text-[9px] px-1.5 py-0.5 rounded-md"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tactile Page Turn Controls & Book Footer */}
                  <div className="mt-10 pt-6 border-t border-[#DED7C8] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-earth-secondary">
                      <Info className="w-4 h-4 text-clay-500" />
                      <span>Zero refined flours, preservatives or synthetic additives.</span>
                    </div>

                    {/* Page Switch Buttons in Terracotta / Sage */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrevPage}
                        disabled={activePageIndex === 0}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                          activePageIndex === 0
                            ? 'opacity-40 cursor-not-allowed bg-sage-100 text-sage-400'
                            : 'bg-sage-800 hover:bg-sage-900 text-earth-surface shadow-xs'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous Page
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={activePageIndex === totalPages - 1}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                          activePageIndex === totalPages - 1
                            ? 'opacity-40 cursor-not-allowed bg-sage-100 text-sage-400'
                            : 'bg-clay-500 hover:bg-clay-600 text-earth-surface shadow-xs'
                        }`}
                      >
                        Next Page <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Closed Menu Cover State */
                <motion.div
                  key="closed-menu"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setIsMenuOpen(true)}
                  className="bg-[#251D1A] text-earth-surface rounded-[2rem] p-12 sm:p-16 text-center cursor-pointer hover:bg-[#2D221F] transition-colors border border-amber-900/40"
                >
                  <div className="w-16 h-16 rounded-full bg-clay-500/20 border border-clay-400/50 flex items-center justify-center mx-auto mb-4 text-clay-300">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold tracking-wider text-earth-linen">
                    SAGE FARM CAFE
                  </h3>
                  <p className="text-xs uppercase tracking-[0.25em] text-clay-400 mt-1">
                    Artisanal Farm-to-Table Menu
                  </p>
                  <button className="mt-6 px-6 py-2.5 rounded-full bg-clay-500 hover:bg-clay-600 text-earth-surface text-xs font-semibold uppercase tracking-wider shadow-lg">
                    Open Table Menu
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
