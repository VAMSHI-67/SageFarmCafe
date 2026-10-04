'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Utensils,
  Image as ImageIcon,
  LayoutDashboard,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X as CloseIcon,
  CheckCircle2,
} from 'lucide-react';

import DashboardView from '@/components/admin/DashboardView';
import MenuView from '@/components/admin/MenuView';
import GalleryView from '@/components/admin/GalleryView';
import SettingsView from '@/components/admin/SettingsView';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'gallery' | 'settings'>('dashboard');

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Showcase Data Stores
  const [categories, setCategories] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [cafeInfo, setCafeInfo] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAuth, resMenu, resGal, resSet] = await Promise.all([
        fetch('/api/admin/session').then((r) => r.json()),
        fetch('/api/menu').then((r) => r.json()),
        fetch('/api/gallery').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
      ]);

      if (!resAuth.authenticated) {
        router.replace('/admin/login');
        return;
      }

      if (resMenu.categories) setCategories(resMenu.categories);
      if (resGal.images) setGallery(resGal.images);
      if (resSet.info) setCafeInfo(resSet.info);
    } catch (e) {
      console.error('Data sync failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu & Dishes', icon: Utensils },
    { id: 'gallery', label: 'Cafe Gallery', icon: ImageIcon },
    { id: 'settings', label: 'Cafe Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#272820] flex flex-col md:flex-row">
      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#163126] text-[#FFFDF8] px-4 py-3 rounded-2xl shadow-xl border border-[#7A8D70]/40 flex items-center gap-2.5 animate-slide-up text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#7A8D70]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Navigation Header */}
      <header className="md:hidden bg-[#163126] text-[#FFFDF8] px-4 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#C96A49] flex items-center justify-center font-serif font-bold text-xs text-[#FFFDF8]">
            S
          </div>
          <span className="font-serif font-bold text-sm tracking-wide">Sage Farm Cafe</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 rounded-lg bg-white/10 text-white"
        >
          {mobileNavOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#163126] text-[#FFFDF8] p-5 flex flex-col justify-between z-40 transition-transform duration-300 md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-3 px-2 py-3 border-b border-white/10 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#C96A49] flex items-center justify-center font-serif font-bold text-base text-[#FFFDF8] shadow-sm">
              S
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm tracking-wide">Sage Farm Cafe</h2>
              <span className="text-[10px] text-[#7A8D70] font-semibold tracking-wider uppercase block">
                Showcase Portal
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#FFFDF8] text-[#163126] shadow-sm'
                      : 'text-[#F7F4EC]/70 hover:bg-white/5 hover:text-[#FFFDF8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C96A49]' : 'text-[#7A8D70]'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#F7F4EC]/80 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#7A8D70]" /> Live Website
            </span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Workspace View Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#163126]" />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                categories={categories}
                gallery={gallery}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'menu' && (
              <MenuView
                categories={categories}
                onRefresh={fetchData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'gallery' && (
              <GalleryView
                gallery={gallery}
                onRefresh={fetchData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                cafeInfo={cafeInfo}
                onRefresh={fetchData}
                onShowToast={showToast}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
