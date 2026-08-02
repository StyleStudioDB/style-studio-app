import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Increase Next.js API route payload size limit to 10MB
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
    
    // Clean base64 string and extract buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Sanitize model name (remove special characters/spaces)
    const safeModelName = modelName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || 'model';
    const safeAngle = angle.trim().toLowerCase();
    
    // Create a flat filename that Supabase Storage accepts without folder path errors
    const filePath = `${safeModelName}_${safeAngle}_${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('outfit-images')
      .upload(filePath, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('outfit-images')
      .getPublicUrl(data.path);

    return res.status(200).json({ url: publicUrlData.publicUrl, angle, modelName });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
