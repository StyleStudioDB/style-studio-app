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
    const { imageBase64, fileName, modelName = 'default', angle = 'front' } = req.body;
    const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');
    
    // Path format in Supabase bucket: models/{modelName}/{angle}_{timestamp}.png
    const filePath = `models/${modelName.toLowerCase().replace(/\s+/g, '_')}/${angle}_${Date.now()}.png`;

    const { data, error } = await supabase.storage
      .from('outfit-images')
      .upload(filePath, buffer, {
        contentType: 'image/png',
        upsert: true
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
