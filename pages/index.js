import { useState } from 'react';

export default function Home() {
  const [modelMode, setModelMode] = useState('turban');
  const [source, setSource] = useState('mixed');
  const [count, setCount] = useState(5);
  const [aiDecide, setAiDecide] = useState(true);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#34d399', margin: 0, fontSize: '22px' }}>STYLE STUDIO AI</h1>
        <span style={{ fontSize: '12px', background: '#1e293b', padding: '4px 10px', borderRadius: '12px' }}>PWA Ready</span>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3>Selected Model Mode</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['turban', 'cap', 'beanie'].map((m) => (
              <button key={m} onClick={() => setModelMode(m)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: modelMode === m ? '#34d399' : '#334155', color: modelMode === m ? '#0f172a' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {m.toUpperCase()} MODEL
              </button>
            ))}
          </div>

          <h3>Outfit Source</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['wardrobe', 'shopping', 'mixed'].map((s) => (
              <button key={s} onClick={() => setSource(s)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: source === s ? '#34d399' : '#334155', color: source === s ? '#0f172a' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          <h3>How Many Outfits</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[2, 5, 10].map((num) => (
              <button key={num} onClick={() => setCount(num)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: count === num ? '#34d399' : '#334155', color: count === num ? '#0f172a' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {num} OUTFITS
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #334155', paddingTop: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Brand Preferences</span>
            <button onClick={() => setAiDecide(!aiDecide)} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: aiDecide ? '#4f46e5' : '#334155', color: '#fff', cursor: 'pointer' }}>
              {aiDecide ? '✓ AI DECIDE ACTIVE' : 'MANUAL BRANDS'}
            </button>
          </div>

          <button style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: '#34d399', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            CREATE OUTFIT REQUEST
          </button>
        </div>
      </main>
    </div>
  );
}
