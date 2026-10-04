'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, Image as ImageIcon, MapPin, Sparkles } from 'lucide-react';
import SageLogo from '@/components/brand/SageLogo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Our Story', href: '#story', icon: BookOpen },
    { label: 'Artisan Menu', href: '#menu', icon: BookOpen },
    { label: 'Gallery', href: '#gallery', icon: ImageIcon },
    { label: 'Visit Us', href: '#visit', icon: MapPin },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7F2E7]/92 backdrop-blur-md shadow-sm py-3 border-b border-[#DED7C8]/70'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Editorial Typography */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="group-hover:scale-105 transition-transform duration-300">
            <SageLogo className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-sm" />
          </div>
          <div>
            <span className="font-serif text-lg sm:text-2xl tracking-[0.16em] text-earth-primary font-bold block leading-none">
              SAGE FARM CAFE
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-clay-500 uppercase font-semibold block mt-0.5">
              HYDERABAD • EST. ORGANIC
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-earth-primary/80 hover:text-clay-500 text-xs sm:text-sm font-medium tracking-wide transition-colors"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#menu"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-clay-500 hover:bg-clay-600 text-earth-surface text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-earth-linen" />
            Explore Menu
          </a>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="#menu"
            className="px-3.5 py-1.5 rounded-full bg-clay-500 text-earth-surface text-[11px] font-semibold uppercase tracking-wider"
          >
            Menu
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-earth-primary hover:bg-sage-100"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#FFFCF5] border-b border-[#DED7C8] px-6 py-6 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-earth-primary text-sm font-medium py-2 border-b border-sage-100"
            >
              <link.icon className="w-4 h-4 text-clay-500" />
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#visit"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-clay-500 text-earth-surface font-semibold text-xs uppercase tracking-wider text-center"
            >
              <MapPin className="w-4 h-4" />
              Visit Sage Farm Cafe
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
