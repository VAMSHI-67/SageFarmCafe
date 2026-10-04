'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle, Utensils, Tag } from 'lucide-react';

interface MenuViewProps {
  categories: any[];
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export default function MenuView({ categories, onRefresh, onShowToast }: MenuViewProps) {
  const [subTab, setSubTab] = useState<'items' | 'categories'>('items');
  const [selectedCat, setSelectedCat] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');

  // Item Modal
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemForm, setItemForm] = useState({
    category_id: 1,
    name: '',
    description: '',
    price: '',
    image_url: '',
    tags: '',
    is_veg: true,
    is_vegan: false,
    is_gluten_free: false,
    is_bestseller: false,
    is_available: true,
  });

  // Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // All Items flattened
  const allItems = categories.flatMap((c) => (c.items || []).map((i: any) => ({ ...i, catName: c.name })));

  const filteredItems = allItems.filter((item) => {
    if (selectedCat !== 'all' && item.category_id !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchTag = (item.tags || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  // Item Handlers
  const openAddItem = () => {
    setEditingItem(null);
    setItemForm({
      category_id: categories[0]?.id || 1,
      name: '',
      description: '',
      price: '',
      image_url: '',
      tags: '',
      is_veg: true,
      is_vegan: false,
      is_gluten_free: false,
      is_bestseller: false,
      is_available: true,
    });
    setError('');
    setItemModalOpen(true);
  };

  const openEditItem = (item: any) => {
    setEditingItem(item);
    setItemForm({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      image_url: item.image_url || '',
      tags: item.tags || '',
      is_veg: item.is_veg === 1,
      is_vegan: item.is_vegan === 1,
      is_gluten_free: item.is_gluten_free === 1,
      is_bestseller: item.is_bestseller === 1,
      is_available: item.is_available === 1,
    });
    setError('');
    setItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = '/api/menu';
      const method = editingItem ? 'PATCH' : 'POST';
      const body = editingItem ? { ...itemForm, id: editingItem.id } : itemForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save menu item');

      onShowToast(editingItem ? 'Menu item updated' : 'Menu item created');
      setItemModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu dish?')) return;
    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        onShowToast('Menu item deleted');
        onRefresh();
      }
    } catch {
      alert('Error connecting to server');
    }
  };

  // Category Handlers
  const openAddCategory = () => {
    setEditingCat(null);
    setCatForm({
      name: '',
      slug: '',
      description: '',
      display_order: categories.length + 1,
      is_active: true,
    });
    setError('');
    setCatModalOpen(true);
  };

  const openEditCategory = (cat: any) => {
    setEditingCat(cat);
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      display_order: cat.display_order,
      is_active: cat.is_active === 1,
    });
    setError('');
    setCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = '/api/categories';
      const method = editingCat ? 'PATCH' : 'POST';
      const body = editingCat ? { ...catForm, id: editingCat.id } : catForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save category');

      onShowToast(editingCat ? 'Category updated' : 'Category created');
      setCatModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs: Items vs Categories */}
      <div className="flex justify-between items-center border-b border-[#DED8CB] pb-3">
        <div className="flex gap-4">
          <button
            onClick={() => setSubTab('items')}
            className={`text-sm font-semibold pb-1 border-b-2 transition-all ${
              subTab === 'items' ? 'border-[#C96A49] text-[#163126]' : 'border-transparent text-[#6E6A61]'
            }`}
          >
            Menu Items ({allItems.length})
          </button>
          <button
            onClick={() => setSubTab('categories')}
            className={`text-sm font-semibold pb-1 border-b-2 transition-all ${
              subTab === 'categories' ? 'border-[#C96A49] text-[#163126]' : 'border-transparent text-[#6E6A61]'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>

        <div>
          {subTab === 'items' ? (
            <button
              onClick={openAddItem}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#163126] text-[#FFFDF8] rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-[#C96A49]" /> Add Dish
            </button>
          ) : (
            <button
              onClick={openAddCategory}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#163126] text-[#FFFDF8] rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-[#C96A49]" /> Add Category
            </button>
          )}
        </div>
      </div>

      {subTab === 'items' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#FFFDF8] border border-[#DED8CB] rounded-xl px-3.5 py-2 text-xs text-[#272820] flex-1"
            />
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="bg-[#FFFDF8] border border-[#DED8CB] rounded-xl px-3 py-2 text-xs text-[#272820]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dishes Table */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#DED8CB] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#272820]">
                <thead className="bg-[#F7F4EC] text-xs uppercase tracking-wider text-[#6E6A61] font-semibold border-b border-[#DED8CB]">
                  <tr>
                    <th className="py-3 px-4">Dish</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Dietary</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DED8CB]/50 text-xs">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F7F4EC]/50">
                      <td className="py-3 px-4 flex items-center gap-3">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#F7F4EC] border border-[#DED8CB] flex items-center justify-center shrink-0">
                            <Utensils className="w-4 h-4 text-[#7A8D70]" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-sm text-[#163126] block">{item.name}</span>
                          <span className="text-[#6E6A61] line-clamp-1">{item.description}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#6E6A61] font-medium">{item.catName}</td>
                      <td className="py-3 px-4 font-bold text-[#C96A49]">₹{item.price}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {item.is_vegan === 1 && <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[10px] font-bold">Vegan</span>}
                          {item.is_gluten_free === 1 && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">GF</span>}
                          {item.is_bestseller === 1 && <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 text-[10px] font-bold">Popular</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.is_available === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {item.is_available === 1 ? 'In Stock' : 'Sold Out'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditItem(item)} className="p-1.5 rounded-lg text-[#6E6A61] hover:text-[#163126]">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#6E6A61]">
                        No dishes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-5 bg-[#FFFDF8] rounded-2xl border border-[#DED8CB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-serif font-bold text-base text-[#163126]">{cat.name}</h4>
                  <span className="text-[10px] bg-[#F7F4EC] px-2 py-0.5 rounded text-[#6E6A61]">Order: #{cat.display_order}</span>
                </div>
                <p className="text-xs text-[#6E6A61] mt-1.5">{cat.description || 'No description provided.'}</p>
                <div className="mt-3 text-xs text-[#7A8D70] font-semibold">
                  Contains {cat.items?.length || 0} active dishes
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DED8CB]/60 flex justify-end gap-2">
                <button
                  onClick={() => openEditCategory(cat)}
                  className="px-3 py-1 bg-[#F7F4EC] hover:bg-[#DED8CB]/40 rounded-lg text-xs font-semibold text-[#163126]"
                >
                  Edit Category
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Modal (Add/Edit) */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-2xl max-w-lg w-full p-6 border border-[#DED8CB] shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-lg text-[#163126] mb-4">
              {editingItem ? `Edit Dish #${editingItem.id}` : 'Add New Menu Item'}
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Category</label>
                <select
                  value={itemForm.category_id}
                  onChange={(e) => setItemForm({ ...itemForm, category_id: parseInt(e.target.value) })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Burrata & Heirloom Pizza"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="650"
                  value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={itemForm.image_url}
                  onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Fresh organic ingredients & tasting notes..."
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={itemForm.is_vegan}
                    onChange={(e) => setItemForm({ ...itemForm, is_vegan: e.target.checked })}
                  />
                  <span>Vegan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={itemForm.is_gluten_free}
                    onChange={(e) => setItemForm({ ...itemForm, is_gluten_free: e.target.checked })}
                  />
                  <span>Gluten Free</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={itemForm.is_bestseller}
                    onChange={(e) => setItemForm({ ...itemForm, is_bestseller: e.target.checked })}
                  />
                  <span>Chef Bestseller</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={itemForm.is_available}
                    onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.checked })}
                  />
                  <span>In Stock</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F7F4EC] text-[#6E6A61] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#163126] text-[#FFFDF8] font-semibold"
                >
                  {loading ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal (Add/Edit) */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-2xl max-w-md w-full p-6 border border-[#DED8CB] shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#163126] mb-4">
              {editingCat ? 'Edit Category' : 'New Menu Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artisanal Sourdough Pizzas"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Category context..."
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6A61] mb-1">Display Order</label>
                <input
                  type="number"
                  value={catForm.display_order}
                  onChange={(e) => setCatForm({ ...catForm, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#F7F4EC] border border-[#DED8CB] rounded-xl p-2.5 text-sm"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F7F4EC] text-[#6E6A61] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#163126] text-[#FFFDF8] font-semibold"
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
