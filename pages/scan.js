import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function ScanWardrobePage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('top');
  const [category, setCategory] = useState('Shirts');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const { data, error } = await supabase.from('wardrobe_items').insert([
        {
          name,
          role,
          category,
          primary_color: color,
          brand,
          image_url: imageUrl,
          is_active: true
        }
      ]);

      if (error) throw error;
      setMessage('Item successfully scanned and added to your wardrobe!');
      setName('');
      setColor('');
      setBrand('');
      setImageUrl('');
    } catch (err) {
      setMessage(`Error saving item: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white">Scan & Add Wardrobe Item</h1>
          <Link href="/" className="text-xs text-blue-400 hover:underline">← Back to Dashboard</Link>
        </div>

        {message && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-3 rounded-lg text-xs">
            {message}
          </div>
        )}

        <form onSubmit={handleSaveItem} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 text-sm">
          <div>
            <label className="block text-slate-400 mb-1">Item Name</label>
            <input
              required
              type="text"
              placeholder="e.g., Navy Oxford Cotton Shirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Garment Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="shoes">Shoes</option>
                <option value="headwear">Headwear</option>
                <option value="outerwear">Outerwear</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g., Shirts, Chinos, Sneakers"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Primary Color</label>
              <input
                type="text"
                placeholder="e.g., Navy Blue"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Brand (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Uniqlo, Nike"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition"
          >
            {isSaving ? 'Saving...' : 'Save to Wardrobe'}
          </button>
        </form>
      </div>
    </div>
  );
}
