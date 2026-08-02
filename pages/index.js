import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function StyleStudioDashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [models, setModels] = useState([]);
  const [styleDnas, setStyleDnas] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activePreview, setActivePreview] = useState(null);
  const [activeRepair, setActiveRepair] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch initial data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [modelsRes, dnasRes, outfitsRes, wardrobeRes] = await Promise.all([
          supabase.from('model_profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('style_dnas').select('*').order('created_at', { ascending: false }),
          supabase.from('outfits').select('*, outfit_products(*)').order('created_at', { ascending: false }),
          supabase.from('wardrobe_items').select('*').order('created_at', { ascending: false }),
        ]);

        if (modelsRes.data) setModels(modelsRes.data);
        if (dnasRes.data) setStyleDnas(dnasRes.data);
        if (outfitsRes.data) setOutfits(outfitsRes.data);
        if (wardrobeRes.data) setWardrobeItems(wardrobeRes.data);
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Trigger Role-Locked Repair via /api/repair
  const handleRunRepair = async (outfit) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outfitId: outfit.id, products: outfit.outfit_products || [] })
      });
      const data = await res.json();
      if (data.success) {
        setActiveRepair(data.repairManifest);
      }
    } catch (err) {
      alert('Failed to initiate repair request');
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger Reference Board Generation via /api/generate-board
  const handleGenerateBoard = async (outfit) => {
    setIsProcessing(true);
    try {
      const activeModel = models.find(m => m.is_active) || models[0] || { id: 'default', name: 'Default Model', mode: 'Turban' };
      const res = await fetch('/api/generate-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outfitId: outfit.id,
          outfitTitle: outfit.title,
          modelProfile: activeModel,
          products: outfit.outfit_products || []
        })
      });
      const data = await res.json();
      if (data.success) {
        setActivePreview(data);
      }
    } catch (err) {
      alert('Failed to generate reference board');
    } finally {
      setIsProcessing(false);
    }
  };

  const navTabs = [
    'Home', 'My Models', 'Scan Wardrobe', 'Wardrobe', 
    'Style DNAs', 'Generate', 'My Outfits', 'Preview Studio', 'Shopping', 'Settings'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-white">Style Studio</h1>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
              v7 database live
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-1">
            {navTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content View */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading database records from Supabase...
          </div>
        ) : (
          <>
            {/* TAB: HOME */}
            {activeTab === 'Home' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-2">Active Database Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Model Profiles</span>
                      <p className="font-medium text-white text-lg">{models.length} Saved</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Wardrobe Items</span>
                      <p className="font-medium text-white text-lg">{wardrobeItems.length} Saved</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Style DNAs</span>
                      <p className="font-medium text-white text-lg">{styleDnas.length} Active</p>
                    </div>
                  </div>
                </div>

                {/* Outfits List */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-slate-200">Outfits ({outfits.length})</h3>
                  {outfits.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
                      No outfits stored yet. Generate your first outfit or add items to your wardrobe!
                    </div>
                  ) : (
                    outfits.map((outfit) => (
                      <div key={outfit.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                          <div>
                            <h4 className="text-lg font-bold text-white">{outfit.title}</h4>
                            <p className="text-xs text-slate-400">{outfit.occasion} • {outfit.vibe} • {outfit.weather}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRunRepair(outfit)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 bg-amber-600/20 text-amber-300 border border-amber-500/30 text-xs font-medium rounded-lg hover:bg-amber-600/30 transition"
                            >
                              Check & Repair Products
                            </button>
                            <button
                              onClick={() => handleGenerateBoard(outfit)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-500 transition shadow"
                            >
                              Preview on Me
                            </button>
                          </div>
                        </div>

                        {/* Garment Roles */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {(outfit.outfit_products || []).map((item) => (
                            <div key={item.id} className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs flex justify-between items-center">
                              <div>
                                <span className="uppercase text-[10px] font-bold text-slate-500 block">{item.role}</span>
                                <p className="font-medium text-slate-200">{item.product_name || 'Unassigned'}</p>
                                <p className="text-slate-400">${item.price || '0'}</p>
                              </div>
                              <span className={`px-2 py-0.5 text-[10px] rounded border ${
                                item.validation_status === 'valid'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}>
                                {item.validation_status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB PLACEHOLDERS */}
            {activeTab !== 'Home' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
                <h3 className="text-xl font-bold text-white">{activeTab} Module</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Live connection established with Supabase for {activeTab.toLowerCase()}.
                </p>
              </div>
            )}
          </>
        )}

        {/* REPAIR MANIFEST MODAL */}
        {activeRepair && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Role-Locked Repair Engine</h3>
              <p className="text-xs text-slate-400">
                The engine isolated unresolved garment roles and locked all valid components in place.
              </p>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Repair Status:</span>
                  <span className="text-amber-400 font-semibold">{activeRepair.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unresolved Roles:</span>
                  <span className="text-rose-400 font-semibold">
                    {activeRepair.unresolved_roles.join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Locked Valid Roles:</span>
                  <span className="text-emerald-400 font-semibold">
                    {activeRepair.locked_products.map(p => p.role).join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveRepair(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW STUDIO MODAL */}
        {activePreview && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">Reference Board Generated</h3>
                <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                  {activePreview.previewId}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">ChatGPT Handoff Command</label>
                <textarea
                  readOnly
                  rows={6}
                  value={activePreview.chatgpt_prompt_command}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => navigator.clipboard.writeText(activePreview.chatgpt_prompt_command)}
                  className="px-3 py-1.5 bg-slate-800 text-xs text-slate-200 font-medium rounded-lg hover:bg-slate-700"
                >
                  Copy Prompt Command
                </button>
                <button
                  onClick={() => setActivePreview(null)}
                  className="px-4 py-2 bg-blue-600 text-xs text-white font-medium rounded-lg hover:bg-blue-500"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
