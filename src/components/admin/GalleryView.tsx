'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface GalleryViewProps {
  gallery: any[];
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export default function GalleryView({ gallery, onRefresh, onShowToast }: GalleryViewProps) {
  const [filter, setFilter] = useState<'all' | 'ambience' | 'food' | 'drinks'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImg, setEditingImg] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: '',
    caption: '',
    image_url: '',
    category: 'ambience',
    featured: true,
    display_order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filtered = gallery.filter((img) => {
    if (filter !== 'all' && img.category !== filter) return false;
    return true;
  });

  const openAdd = () => {
    setEditingImg(null);
    setForm({
      title: '',
      caption: '',
      image_url: '',
      category: 'ambience',
      featured: true,
      display_order: 0,
    });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (img: any) => {
    setEditingImg(img);
    setForm({
      title: img.title || '',
      caption: img.caption || '',
      image_url: img.image_url,
      category: img.category || 'ambience',
      featured: img.featured === 1,
      display_order: img.display_order || 0,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = '/api/gallery';
      const method = editingImg ? 'PATCH' : 'POST';
      const body = editingImg ? { ...form, id: editingImg.id } : form;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save image');

      onShowToast(editingImg ? 'Photo updated' : 'Photo added');
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this photo from the public gallery?')) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        onShowToast('Photo removed');
        onRefresh();
      }
    } catch {
      alert('Error deleting photo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* Category Filters */}
        <div className="flex gap-2">
          {['all', 'ambience', 'food', 'drinks'].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === c ? 'bg-[#163126] text-[#FFFDF8]' : 'bg-[#FFFDF8] border border-[#DED8CB] text-[#6E6A61]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#163126] text-[#FFFDF8] rounded-xl text-xs font-semibold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 text-[#C96A49]" /> Add Photo
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((img) => (
          <div key={img.id} className="bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#DED8CB] shadow-sm flex flex-col justify-between">
            <div className="h-48 w-full bg-stone-100 relative">
              <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => openEdit(img)}
                  className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <span className="text-[10px] uppercase font-bold text-[#C96A49] block">{img.category}</span>
              <h5 className="font-serif font-bold text-sm text-[#163126] mt-0.5">{img.title}</h5>
              <p className="text-xs text-[#6E6A61] mt-1 line-clamp-2">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-2xl max-w-md w-full p-6 border border-[#DED8CB] shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-lg text-[#163126] mb-4">
              {editingImg ? 'Edit Photo' : 'Add Photo to Gallery'}
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garden Courtyard Sunlit"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                >
                  <option value="ambience">Ambience & Courtyard</option>
                  <option value="food">Farm Plates & Bakery</option>
                  <option value="drinks">Beverages & Coffee</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F7F4EC] text-[#6E6A61] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#163126] text-[#FFFDF8] font-semibold"
                >
                  {loading ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
