'use client';

import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface SettingsViewProps {
  cafeInfo: any;
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export default function SettingsView({ cafeInfo, onRefresh, onShowToast }: SettingsViewProps) {
  const [form, setForm] = useState({
    name: cafeInfo?.name || 'Sage Farm Cafe',
    tagline: cafeInfo?.tagline || 'Artisanal Organic Dining & Living Space',
    description: cafeInfo?.description || '',
    address: cafeInfo?.address || '',
    phone1: cafeInfo?.phone1 || '',
    phone2: cafeInfo?.phone2 || '',
    email: cafeInfo?.email || '',
    opening_hours: cafeInfo?.opening_hours || 'Daily: 10:30 AM – 10:30 PM',
    instagram_url: cafeInfo?.instagram_url || 'https://www.instagram.com/sagefarmcafe',
    google_maps_url: cafeInfo?.google_maps_url || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      onShowToast('Business information saved successfully');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-[#FFFDF8] rounded-2xl border border-[#DED8CB] p-6 sm:p-8 shadow-sm">
      <div className="border-b border-[#DED8CB] pb-4 mb-6">
        <h3 className="font-serif font-bold text-xl text-[#163126]">General Cafe Information</h3>
        <p className="text-xs text-[#6E6A61] mt-1">
          These details are synchronized across the public website, footer, visit sections, and search metadata.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Basic Brand */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-sm text-[#163126]">Brand Identity</h4>
          <div>
            <label className="block font-semibold text-[#6E6A61] mb-1">Cafe Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#6E6A61] mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#6E6A61] mb-1">Editorial Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4 pt-4 border-t border-[#DED8CB]/60">
          <h4 className="font-serif font-bold text-sm text-[#163126]">Location & Contact</h4>
          <div>
            <label className="block font-semibold text-[#6E6A61] mb-1">Address</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#6E6A61] mb-1">Primary Phone</label>
              <input
                type="text"
                required
                value={form.phone1}
                onChange={(e) => setForm({ ...form, phone1: e.target.value })}
                className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#6E6A61] mb-1">Secondary Phone (Optional)</label>
              <input
                type="text"
                value={form.phone2}
                onChange={(e) => setForm({ ...form, phone2: e.target.value })}
                className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#6E6A61] mb-1">Inquiry Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#6E6A61] mb-1">Operating Hours</label>
              <input
                type="text"
                required
                value={form.opening_hours}
                onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
                className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4 pt-4 border-t border-[#DED8CB]/60">
          <h4 className="font-serif font-bold text-sm text-[#163126]">Social & Map Links</h4>
          <div>
            <label className="block font-semibold text-[#6E6A61] mb-1">Instagram URL</label>
            <input
              type="url"
              value={form.instagram_url}
              onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#6E6A61] mb-1">Google Maps URL</label>
            <input
              type="url"
              value={form.google_maps_url}
              onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
              className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#163126] text-[#FFFDF8] font-semibold text-xs uppercase tracking-wider shadow-md hover:bg-[#163126]/90 transition-colors"
          >
            <Save className="w-4 h-4 text-[#C96A49]" />
            {loading ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
