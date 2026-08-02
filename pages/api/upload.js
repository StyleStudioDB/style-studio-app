import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, modelName = 'default', angle = 'front' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    // Convert Base64 string to Buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Clean name string for safe file naming
    const safeModel = String(modelName).trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || 'model';
    const safeAngle = String(angle).trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || 'front';
    const fileName = `${safeModel}_${safeAngle}_${Date.now()}.jpg`;

    // Upload to 'outfit-images' public bucket
    const { data, error } = await supabase.storage
      .from('outfit-images')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('outfit-images')
      .getPublicUrl(fileName);

    return res.status(200).json({ 
      url: publicUrlData.publicUrl, 
      angle: safeAngle, 
      modelName: safeModel 
    });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
