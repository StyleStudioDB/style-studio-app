import { useState } from 'react';

export default function Home() {
  const [modelMode, setModelMode] = useState('turban');
  const [source, setSource] = useState('mixed');
  const [count, setCount] = useState(5);
  const [aiDecide, setAiDecide] = useState(true);

  // Dynamic States
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [outfitResults, setOutfitResults] = useState('');

  // 1. Handle File Upload to Supabase Storage
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: reader.result,
            fileName: `${Date.now()}_${file.name}`,
          }),
        });

        const data = await res.json();
        if (data.url) {
          setUploadedUrl(data.url);
        } else {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Upload failed: ' + err.message);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // 2. Handle Outfit Generation via Gemini API
  const handleGenerateOutfit = async () => {
    setLoading(true);
    setOutfitResults('');

    try {
      const res = await fetch('/api/generate-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelMode,
          source,
          count,
          aiDecide,
          imageUrl: uploadedUrl,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setOutfitResults(data.result);
      } else {
        alert('Generation failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Generation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#34d399', margin: 0, fontSize: '22px' }}>STYLE STUDIO AI</h1>
        <span style={{ fontSize: '12px', background: '#1e293b', padding: '4px 10px', borderRadius: '12px' }}>PWA Ready</span>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          
          {/* Photo Upload Section */}
          <div style={{ marginBottom: '25px', padding: '15px', background: '#0f172a', borderRadius: '8px', border: '1px dashed #475569' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>1. Upload Wardrobe Photo or Reference</h3>
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} style={{ color: '#94a3b8' }} />
            {uploading && <p style={{ color: '#38bdf8', fontSize: '14px', margin: '10px 0 0' }}>Uploading to Supabase...</p>}
            {uploadedUrl && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ color: '#34d399', fontSize: '12px', margin: '0 0 5px' }}>✓ Image Synced to Supabase</p>
                <img src={uploadedUrl} alt="Uploaded Item" style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <h3>2. Selected Model Mode</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['turban', 'cap', 'beanie'].map((m) => (
              <button key={m} onClick={() => setModelMode(m)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: modelMode === m ? '#34d399' : '#334155', color: modelMode === m ? '#0f172a' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <h3>3. Outfit Source</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['wardrobe', 'shopping', 'mixed'].map((s) => (
              <button key={s} onClick={() => setSource(s)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: source === s ? '#34d399' : '#334155', color: source === s ? '#0f172a' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          <h3>4. Outfit Count</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[2, 5, 10].map((num) => (
              <button key={num} onClick={() => setCount(num)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: count === num ? '#34d399' : '#334155', color: count === num ? '#0f172a' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {num} OUTFITS
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #334155', paddingTop: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Brand Engine</span>
            <button onClick={() => setAiDecide(!aiDecide)} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: aiDecide ? '#4f46e5' : '#334155', color: '#fff', cursor: 'pointer' }}>
              {aiDecide ? '✓ AI DECIDE ACTIVE' : 'MANUAL BRANDS'}
            </button>
          </div>

          <button onClick={handleGenerateOutfit} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: loading ? '#64748b' : '#34d399', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'GENERATING STYLES WITH GEMINI AI...' : 'CREATE OUTFIT REQUEST'}
          </button>
        </div>

        {/* AI Recommendations Output Display */}
        {outfitResults && (
          <div style={{ marginTop: '25px', background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #34d399' }}>
            <h3 style={{ color: '#34d399', marginTop: 0 }}>Stylist AI Recommendations</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#0f172a', padding: '15px', borderRadius: '8px', fontSize: '13px', color: '#e2e8f0' }}>
              {outfitResults}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
