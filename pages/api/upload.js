import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Increase API payload limit for Next.js
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
    const { imageBase64, modelName = 'model', angle = 'front' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Convert Base64 data to binary Buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Clean name: alphanumeric characters only
    const cleanModel = String(modelName).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanAngle = String(angle).toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Simple, flat filename without subfolders to ensure valid pathing
    const fileName = `${cleanModel || 'model'}_${cleanAngle || 'front'}_${Date.now()}.jpg`;

    // Target bucket (Ensure your bucket in Supabase dashboard is named "outfit-images")
    const BUCKET_NAME = 'outfit-images';

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Supabase Upload Error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Get public URL for the uploaded photo
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return res.status(200).json({ 
      url: publicUrlData.publicUrl, 
      angle: cleanAngle, 
      modelName: cleanModel 
    });

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Server error during upload' });
  }
}
