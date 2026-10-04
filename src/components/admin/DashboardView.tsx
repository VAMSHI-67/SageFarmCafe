'use client';

import { useState } from 'react';
import {
  Utensils,
  Image as ImageIcon,
  FolderTree,
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  Edit,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  categories: any[];
  gallery: any[];
  onNavigateTab: (tab: 'menu' | 'gallery' | 'settings') => void;
  onOpenAddDish?: () => void;
  onOpenAddPhoto?: () => void;
}

export default function DashboardView({
  categories,
  gallery,
  onNavigateTab,
}: DashboardProps) {
  const allDishes = categories.flatMap((c) => (c.items || []).map((i: any) => ({ ...i, catName: c.name })));
  const availableDishes = allDishes.filter((i) => i.is_available === 1);
  const soldOutDishes = allDishes.filter((i) => i.is_available === 0);
  const featuredPhotos = gallery.filter((g) => g.featured === 1);
  const signatureDishes = allDishes.filter((i) => i.is_bestseller === 1);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#163126] rounded-3xl p-6 sm:p-8 text-[#FFFDF8] shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#7A8D70] block mb-2">
            Showcase Management
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
            Sage Farm Cafe Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#FFFDF8]/80 mt-2 leading-relaxed">
            Manage your public menu, botanical photography gallery, and live cafe location details. All changes sync directly to the live website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigateTab('menu')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C96A49] hover:bg-[#C96A49]/90 text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Utensils className="w-4 h-4" /> Manage Menu
          </button>
          <button
            onClick={() => onNavigateTab('gallery')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <ImageIcon className="w-4 h-4" /> Manage Gallery
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('menu')}
          className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#DED8CB] shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#C96A49] transition-all group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6A61]">Menu Items</span>
            <div className="p-2 bg-[#F7F4EC] rounded-xl group-hover:bg-[#C96A49]/10 transition-colors">
              <Utensils className="w-4 h-4 text-[#C96A49]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif font-bold text-[#163126]">{allDishes.length}</span>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6E6A61]">
              <span className="text-emerald-700 font-semibold">{availableDishes.length} in stock</span>
              <span>•</span>
              <span className="text-red-600 font-semibold">{soldOutDishes.length} sold out</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('menu')}
          className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#DED8CB] shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#7A8D70] transition-all group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6A61]">Categories</span>
            <div className="p-2 bg-[#F7F4EC] rounded-xl group-hover:bg-[#7A8D70]/10 transition-colors">
              <FolderTree className="w-4 h-4 text-[#7A8D70]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif font-bold text-[#163126]">{categories.length}</span>
            <span className="text-xs text-[#6E6A61] ml-2">active sections</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('gallery')}
          className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#DED8CB] shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#163126] transition-all group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6A61]">Gallery Photos</span>
            <div className="p-2 bg-[#F7F4EC] rounded-xl group-hover:bg-[#163126]/10 transition-colors">
              <ImageIcon className="w-4 h-4 text-[#163126]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif font-bold text-[#163126]">{gallery.length}</span>
            <span className="text-xs text-[#6E6A61] ml-2">showcase photos</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('gallery')}
          className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#DED8CB] shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#C96A49] transition-all group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6A61]">Featured Media</span>
            <div className="p-2 bg-[#F7F4EC] rounded-xl group-hover:bg-[#C96A49]/10 transition-colors">
              <Sparkles className="w-4 h-4 text-[#C96A49]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif font-bold text-[#163126]">{featuredPhotos.length}</span>
            <span className="text-xs text-[#6E6A61] ml-2">highlighted</span>
          </div>
        </div>
      </div>

      {/* Showcase Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Signature Dishes & Stock Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Signature / Popular Dishes */}
          <div className="bg-[#FFFDF8] border border-[#DED8CB] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#DED8CB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C96A49]" />
                <h3 className="font-serif font-bold text-base text-[#163126]">
                  Signature & Popular Dishes
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('menu')}
                className="text-xs font-semibold text-[#C96A49] hover:underline flex items-center gap-1"
              >
                View all dishes <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#DED8CB]/50">
              {signatureDishes.slice(0, 5).map((dish) => (
                <div key={dish.id} className="p-4 px-6 flex items-center justify-between gap-4 hover:bg-[#F7F4EC]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {dish.image_url ? (
                      <img src={dish.image_url} alt={dish.name} className="w-11 h-11 rounded-xl object-cover bg-stone-100 shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-[#F7F4EC] flex items-center justify-center shrink-0">
                        <Utensils className="w-4 h-4 text-[#7A8D70]" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm text-[#163126]">{dish.name}</h4>
                      <p className="text-xs text-[#6E6A61]">{dish.catName} • ₹{dish.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${dish.is_available === 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {dish.is_available === 1 ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              ))}
              {signatureDishes.length === 0 && (
                <div className="p-8 text-center text-xs text-[#6E6A61]">
                  No signature dishes marked yet. Edit dishes in the Menu tab to mark them as Bestseller / Signature.
                </div>
              )}
            </div>
          </div>

          {/* Quick Category Summary */}
          <div className="bg-[#FFFDF8] border border-[#DED8CB] rounded-2xl shadow-sm p-6">
            <h3 className="font-serif font-bold text-base text-[#163126] mb-4">
              Menu Category Distribution
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-[#F7F4EC] border border-[#DED8CB]/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[#163126] block">{c.name}</span>
                    <span className="text-[11px] text-[#6E6A61]">{c.items?.length || 0} dishes listed</span>
                  </div>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#DED8CB] text-[#6E6A61]">
                    #{c.display_order}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Quick Actions & Recent Gallery */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#FFFDF8] border border-[#DED8CB] rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#163126]">
              Quick Showcase Actions
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => onNavigateTab('menu')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#F7F4EC] hover:bg-[#DED8CB]/40 border border-[#DED8CB] text-left transition-colors text-xs font-semibold text-[#163126]"
              >
                <div className="flex items-center gap-2.5">
                  <Utensils className="w-4 h-4 text-[#C96A49]" />
                  <span>Update Menu & Prices</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6E6A61]" />
              </button>

              <button
                onClick={() => onNavigateTab('gallery')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#F7F4EC] hover:bg-[#DED8CB]/40 border border-[#DED8CB] text-left transition-colors text-xs font-semibold text-[#163126]"
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-[#7A8D70]" />
                  <span>Add / Rearrange Photos</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6E6A61]" />
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#F7F4EC] hover:bg-[#DED8CB]/40 border border-[#DED8CB] text-left transition-colors text-xs font-semibold text-[#163126]"
              >
                <div className="flex items-center gap-2.5">
                  <Edit className="w-4 h-4 text-[#163126]" />
                  <span>Edit Cafe Hours & Address</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6E6A61]" />
              </button>
            </div>
          </div>

          {/* Gallery Snapshot */}
          <div className="bg-[#FFFDF8] border border-[#DED8CB] rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-base text-[#163126]">
                Gallery Highlights
              </h3>
              <button
                onClick={() => onNavigateTab('gallery')}
                className="text-xs font-semibold text-[#C96A49] hover:underline"
              >
                View all ({gallery.length})
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {gallery.slice(0, 6).map((img) => (
                <div key={img.id} className="h-20 rounded-xl overflow-hidden bg-stone-100 relative group border border-[#DED8CB]">
                  <img src={img.image_url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {img.featured === 1 && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C96A49]" title="Featured" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
