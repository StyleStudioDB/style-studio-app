import { useState } from 'react';

export default function Home() {
  const [modelMode, setModelMode] = useState('turban');
  const [source, setSource] = useState('mixed');
  const [count, setCount] = useState(5);
  const [aiDecide, setAiDecide] = useState(true);

  // Model Profile & Angles State
  const [selectedModel, setSelectedModel] = useState('Model 1');
  const [modelPhotos, setModelPhotos] = useState({
    front: '',
    left: '',
    right: '',
    back: ''
  });

  // Dynamic States
  const [loading, setLoading] = useState(false);
  const [uploadingAngle, setUploadingAngle] = useState(null);
  const [outfitResults, setOutfitResults] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);

  // Handle Multi-Angle Uploads
  const handleAngleUpload = async (e, angle) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAngle(angle);
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: reader.result,
            fileName: `${angle}_${file.name}`,
            modelName: selectedModel,
            angle: angle,
          }),
        });

        const data = await res.json();
        if (data.url) {
          setModelPhotos((prev) => ({ ...prev, [angle]: data.url }));
        } else {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Upload failed: ' + err.message);
      } finally {
        setUploadingAngle(null);
      }
    };

    reader.readAsDataURL(file);
  };

  // Generate Outfits with Gemini AI
  const handleGenerateOutfit = async () => {
    setLoading(true);
    setOutfitResults([]);

    try {
      const res = await fetch('/api/generate-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelMode,
          source,
          count,
          aiDecide,
          modelName: selectedModel,
          modelPhotos: modelPhotos,
        }),
      });

      const data = await res.json();
      if (data.result) {
        try {
          const cleanText = data.result.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          setOutfitResults(Array.isArray(parsed) ? parsed : [parsed]);
        } catch {
          setOutfitResults([{ title: 'AI Recommendation', details: data.result }]);
        }
      } else {
        alert('Generation failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Generation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save Outfit
  const handleSaveOutfit = (outfit) => {
    const newSave = {
      ...outfit,
      savedAt: new Date().toLocaleDateString(),
      modelName: selectedModel,
      photos: { ...modelPhotos },
      modelMode,
    };
    setSavedOutfits([newSave, ...savedOutfits]);
    alert(`Outfit saved for ${selectedModel}!`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#34d399', margin: 0, fontSize: '22px' }}>STYLE STUDIO AI</h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Multi-Angle Model Styling Engine</p>
        </div>
        <span style={{ fontSize: '12px', background: '#1e293b', border: '1px solid #34d399', color: '#34d399', padding: '4px 10px', borderRadius: '12px' }}>PWA Ready</span>
      </header>

      <main style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          
          {/* Section 1: Model Selection */}
          <div style={{ marginBottom: '25px', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#38bdf8' }}>1. Select or Name Model Profile</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="text" 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
                placeholder="Model Name (e.g. Self, Alex)"
                style={{ background: '#0f172a', border: '1px solid #475569', color: '#fff', padding: '10px', borderRadius: '8px', flex: 1 }}
              />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Photos assign directly to this model</span>
            </div>
          </div>

          {/* Section 2: Multi-Angle Photo Uploads */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#38bdf8' }}>2. Upload Model Angles for [{selectedModel}]</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px' }}>
              {['front', 'left', 'right', 'back'].map((angle) => (
                <div key={angle} style={{ background: '#0f172a', border: '1px dashed #475569', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 8px', textTransform: 'uppercase', fontSize: '12px', color: '#34d399' }}>{angle} View</h4>
                  
                  {modelPhotos[angle] ? (
                    <div>
                      <img src={modelPhotos[angle]} alt={angle} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px', border: '1px solid #34d399' }} />
                      <label style={{ fontSize: '11px', color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>
                        Change
                        <input type="file" accept="image/*" onChange={(e) => handleAngleUpload(e, angle)} style={{ display: 'none' }} />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '24px' }}>📷</div>
                      <label style={{ background: '#334155', color: '#fff', fontSize: '12px', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-block', width: '80%' }}>
                        {uploadingAngle === angle ? 'Uploading...' : `Add ${angle}`}
                        <input type="file" accept="image/*" onChange={(e) => handleAngleUpload(e, angle)} disabled={uploadingAngle === angle} style={{ display: 'none' }} />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Model Mode */}
          <h3>3. Selected Model Headwear / Style</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['turban', 'cap', 'beanie'].map((m) => (
              <button key={m} onClick={() => setModelMode(m)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: modelMode === m ? '#34d399' : '#334155', color: modelMode === m ? '#0f172a' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Section 4: Outfit Strategy */}
          <h3>4. Outfit Source</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['wardrobe', 'shopping', 'mixed'].map((s) => (
              <button key={s} onClick={() => setSource(s)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: source === s ? '#34d399' : '#334155', color: source === s ? '#0f172a' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          <h3>5. Outfit Count</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[2, 5, 10].map((num) => (
              <button key={num} onClick={() => setCount(num)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: count === num ? '#34d399' : '#334155', color: count === num ? '#0f172a' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {num} OUTFITS
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #334155', paddingTop: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Brand Engine</span>
            <button onClick={() => setAiDecide(!aiDecide)} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: aiDecide ? '#4f46e5' : '#334155', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
              {aiDecide ? '✓ AI DECIDE ACTIVE' : 'MANUAL BRANDS'}
            </button>
          </div>

          <button onClick={handleGenerateOutfit} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: loading ? '#64748b' : '#34d399', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? `ANALYZING 360° ANGLES FOR ${selectedModel.toUpperCase()}...` : 'CREATE OUTFIT REQUEST'}
          </button>
        </div>

        {/* Results */}
        {outfitResults.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#34d399', marginBottom: '15px' }}>Generated Outfit Recommendations for {selectedModel}</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {outfitResults.map((outfit, index) => (
                <div key={index} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#38bdf8' }}>{outfit.title || `Outfit #${index + 1}`}</h3>
                    <button onClick={() => handleSaveOutfit(outfit)} style={{ background: '#34d399', color: '#0f172a', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                      💾 Save Outfit
                    </button>
                  </div>

                  {outfit.items && Array.isArray(outfit.items) ? (
                    <ul style={{ paddingLeft: '20px', color: '#e2e8f0', margin: '10px 0' }}>
                      {outfit.items.map((item, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#e2e8f0', fontSize: '14px' }}>{outfit.details || JSON.stringify(outfit)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Gallery */}
        {savedOutfits.length > 0 && (
          <div style={{ marginTop: '40px', borderTop: '2px solid #334155', paddingTop: '20px' }}>
            <h2 style={{ color: '#38bdf8' }}>⭐ Saved Outfits Gallery ({savedOutfits.length})</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {savedOutfits.map((saved, idx) => (
                <div key={idx} style={{ background: '#0f172a', border: '1px solid #475569', borderRadius: '10px', padding: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {saved.photos?.front && (
                    <img src={saved.photos.front} alt="Front Ref" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #34d399' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px', color: '#34d399' }}>{saved.title || `Outfit #${idx + 1}`} ({saved.modelName})</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Saved on {saved.savedAt} • Headwear: {saved.modelMode}</p>
                    {saved.items && <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#cbd5e1' }}>{saved.items.join(' • ')}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
