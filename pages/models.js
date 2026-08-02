import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function ModelProfilesPage() {
  const [models, setModels] = useState([]);
  const [name, setName] = useState('');
  const [mode, setMode] = useState('Turban');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchModels = async () => {
    const { data } = await supabase.from('model_profiles').select('*').order('created_at', { ascending: false });
    if (data) setModels(data);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleCreateModel = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('model_profiles').insert([
        {
          name,
          mode,
          primary_photo_url: photoUrl,
          is_active: true
        }
      ]);
      if (error) throw error;
      setName('');
      setPhotoUrl('');
      fetchModels();
    } catch (err) {
      alert(`Error creating profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white">Model Profiles</h1>
          <Link href="/" className="text-xs text-blue-400 hover:underline">← Back to Dashboard</Link>
        </div>

        {/* Create Profile Form */}
        <form onSubmit={handleCreateModel} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 text-sm">
          <h2 className="font-semibold text-white">New Model Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              required
              type="text"
              placeholder="Model Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Mode (e.g., Turban, Cap)"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
            />
            <input
              type="url"
              placeholder="Primary Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition"
          >
            {isSaving ? 'Creating...' : 'Create Model Profile'}
          </button>
        </form>

        {/* Existing Models */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 items-center text-xs">
              <div className="w-16 h-16 bg-slate-950 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800">
                {m.primary_photo_url ? (
                  <img src={m.primary_photo_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">No Img</div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{m.name}</h3>
                <p className="text-slate-400">Headwear Mode: {m.mode}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {m.is_active ? 'Active Profile' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
