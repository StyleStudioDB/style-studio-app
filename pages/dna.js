import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function StyleDnaPage() {
  const [dnas, setDnas] = useState([]);
  const [title, setTitle] = useState('');
  const [favColors, setFavColors] = useState('');
  const [avoidColors, setAvoidColors] = useState('');

  const fetchDnas = async () => {
    const { data } = await supabase.from('style_dnas').select('*').order('created_at', { ascending: false });
    if (data) setDnas(data);
  };

  useEffect(() => {
    fetchDnas();
  }, []);

  const handleCreateDna = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('style_dnas').insert([
        {
          title,
          preferred_colors: favColors.split(',').map(c => c.trim()),
          colors_to_avoid: avoidColors.split(',').map(c => c.trim()),
          is_active: true
        }
      ]);
      if (error) throw error;
      setTitle('');
      setFavColors('');
      setAvoidColors('');
      fetchDnas();
    } catch (err) {
      alert(`Error creating DNA: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white">Style DNA Presets</h1>
          <Link href="/" className="text-xs text-blue-400 hover:underline">← Back to Dashboard</Link>
        </div>

        <form onSubmit={handleCreateDna} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 text-sm">
          <h2 className="font-semibold text-white">Add Style Preset</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              required
              type="text"
              placeholder="Preset Title (e.g. Summer Smart Casual)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Favorite Colors (comma separated)"
              value={favColors}
              onChange={(e) => setFavColors(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Colors to Avoid (comma separated)"
              value={avoidColors}
              onChange={(e) => setAvoidColors(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition"
          >
            Create Style DNA
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dnas.map((dna) => (
            <div key={dna.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <h3 className="font-bold text-white text-sm">{dna.title}</h3>
              <p className="text-slate-400">
                Preferred: {Array.isArray(dna.preferred_colors) ? dna.preferred_colors.join(', ') : 'None'}
              </p>
              <p className="text-slate-500">
                Avoid: {Array.isArray(dna.colors_to_avoid) ? dna.colors_to_avoid.join(', ') : 'None'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
