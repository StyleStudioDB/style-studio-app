import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Home');
  const [uploading, setUploading] = useState(false);

  // Default state for Models
  const [models, setModels] = useState([
    {
      id: 'turban',
      name: 'Turban Model',
      mode: 'Turban mode',
      active: false,
      angles: { front: '/placeholder-model.jpg', left: null, right: null, back: null },
    },
    {
      id: 'cap',
      name: 'Baseball Cap Model',
      mode: 'Baseball Cap mode',
      active: true,
      angles: {
        front: '/placeholder-cap-front.jpg',
        left: '/placeholder-cap-left.jpg',
        right: '/placeholder-cap-right.jpg',
        back: '/placeholder-cap-back.jpg',
      },
    },
    {
      id: 'beanie',
      name: 'Beanie Model',
      mode: 'Beanie mode',
      active: false,
      angles: { front: null, left: null, right: null, back: null },
    },
  ]);

  // Default state for Outfits
  const [outfits] = useState([
    {
      id: '1',
      title: '3. Linen Shirt + Olive Chino',
      style: 'Everyday · relaxed refined · Baseball Cap',
      weather: 'Current weather',
      inStock: true,
      previewUrl: '/placeholder-cap-front.jpg',
      items: [{ name: 'Principle Dress Leather Strap Watch', category: 'Accessories' }],
    },
    {
      id: '2',
      title: '2. White Oxford + Navy Chino',
      style: 'Everyday · crisp smart casual · Baseball Cap',
      weather: 'Current weather',
      inStock: true,
      previewUrl: '/placeholder-cap-front.jpg',
      items: [
        { name: 'Principle Dress Leather Strap Watch', category: 'Accessories' },
        { name: 'Oxford Slim Shirt', category: 'Top' },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <Head>
        <title>Style Studio AI</title>
      </Head>

      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight text-white">Style Studio</span>
            <span className="text-[10px] bg-slate-800 text-emerald-400 border border-slate-700 px-2 py-0.5 rounded-full font-mono">v7 manual-first</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {['Home', 'My Models', 'Scan Wardrobe', 'Wardrobe', 'Headwear Studio', 'Generate', 'My Outfits', 'Shopping', 'Preview Studio', 'Style DNAs', 'History', 'Settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="text-xs text-slate-400 font-mono">Ready</div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TAB 1: HOME */}
        {activeTab === 'Home' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Zero Typing Wardrobe</span>
                  <h1 className="text-4xl font-extrabold text-white mt-2 leading-tight">Upload photos.<br />Tap a look.<br />See it on you.</h1>
                  <p className="text-sm text-slate-400 mt-4 max-w-lg leading-relaxed">
                    Style Studio stores your model modes and wardrobe, then hands outfit requests to your Custom GPT for search and previewing without extra API fees.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 mt-8">
                  <button onClick={() => setActiveTab('Scan Wardrobe')} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all">Scan clothing</button>
                  <button onClick={() => setActiveTab('Generate')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all">Generate outfits</button>
                  <button onClick={() => setActiveTab('My Models')} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all">Set up models</button>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Active Setup</span>
                <h2 className="text-base font-bold text-white mt-1">Baseball Cap Model · Everyday Smart Casual</h2>
                <div className="mt-4 space-y-3">
                  {['Front model photo', 'Wardrobe', 'Style DNA'].map((step) => (
                    <div key={step} className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-300">✓ {step}</span>
                      <span className="text-[10px] text-emerald-500 font-mono uppercase">Ready</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY MODELS */}
        {activeTab === 'My Models' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Your Visual Identity</span>
              <h2 className="text-2xl font-extrabold text-white">My Models</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between w-full overflow-hidden ${
                    model.active ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-white">{model.name}</h3>
                      {model.active && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Active</span>}
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{model.mode}</p>

                    {/* Fixed Angle Grid Container - prevents spillover */}
                    <div className="grid grid-cols-4 gap-2 w-full min-w-0">
                      {['front', 'left', 'right', 'back'].map((angle) => (
                        <div key={angle} className="relative aspect-[3/4] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center min-w-0 w-full">
                          {model.angles[angle] ? (
                            <img src={model.angles[angle]} alt={angle} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{angle}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <button className="w-full py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold hover:bg-emerald-500/20 transition-all">
                      Add photos / video
                    </button>
                    <button className="w-full py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-700 transition-all">
                      Allow another headwear item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MY OUTFITS */}
        {activeTab === 'My Outfits' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Your Saved Looks</span>
              <h2 className="text-2xl font-extrabold text-white">My Outfits</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {outfits.map((outfit) => (
                <div key={outfit.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-auto w-full">
                  <div className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden">
                    <img src={outfit.previewUrl} alt={outfit.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-grow">
                    <h3 className="text-sm font-bold text-white leading-snug">{outfit.title}</h3>
                    <p className="text-xs text-slate-400">{outfit.style}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-full">{outfit.weather}</span>
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 rounded-full">In stock</span>
                    </div>

                    {/* Accessories / Items Container - Non-truncated */}
                    <div className="mt-auto pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                      {outfit.items.map((item, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                          <span className="text-xs text-slate-200 font-medium">{item.name}</span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">{item.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Tabs Fallback */}
        {!['Home', 'My Models', 'My Outfits'].includes(activeTab) && (
          <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <h3 className="text-lg font-bold text-white">{activeTab} Module Active</h3>
            <p className="text-xs text-slate-400 mt-2">Ready to process requests for {activeTab.toLowerCase()}.</p>
          </div>
        )}

      </main>
    </div>
  );
}
