export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelMode, count = 5, occasion, temperature, vibe } = req.body;

    // Simulated generated response structure for custom GPT pipeline
    const generatedOutfits = Array.from({ length: Math.min(count, 10) }).map((_, idx) => ({
      id: `generated_${Date.now()}_${idx + 1}`,
      title: `Look ${idx + 1}: ${vibe || 'Smart Casual'} ${occasion || 'Everyday'}`,
      modelMode: modelMode || 'Baseball Cap Model',
      temperature: temperature || '50–64°F',
      items: [
        { name: 'Classic Oxford Shirt', category: 'Top' },
        { name: 'Slim Fit Chinos', category: 'Bottoms' },
      ],
      status: 'completed',
    }));

    return res.status(200).json({
      success: true,
      requestTimestamp: new Date().toISOString(),
      outfits: generatedOutfits,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Generation failed' });
  }
}
