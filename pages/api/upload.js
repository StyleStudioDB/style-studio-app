import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, fileName } = req.body;
    const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');
    
    const { data, error } = await supabase.storage
      .from('outfit-images')
      .upload(`wardrobe/${fileName}`, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('outfit-images')
      .getPublicUrl(data.path);

    return res.status(200).json({ url: publicUrlData.publicUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
