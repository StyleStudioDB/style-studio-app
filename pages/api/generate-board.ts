import type { NextApiRequest, NextApiResponse } from 'next';
import { calculateManifestHash, buildChatGPTCommand } from '../../lib/board';
import { ModelProfile, OutfitProduct } from '../../types/studio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { outfitId, outfitTitle, modelProfile, products } = req.body as {
    outfitId: string;
    outfitTitle: string;
    modelProfile: ModelProfile;
    products: OutfitProduct[];
  };

  if (!outfitId || !modelProfile || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  // 1. Compile the manifest payload
  const manifestPayload = {
    modelId: modelProfile.id,
    outfitId,
    items: products.map(p => ({ role: p.role, url: p.image_url })),
    timestamp: new Date().toISOString(),
  };

  // 2. Generate Hash
  const manifestHash = await calculateManifestHash(manifestPayload);
  const previewId = `prev_${manifestHash.slice(0, 12)}`;

  // 3. Build ChatGPT Prompt Command
  const chatgptPromptCommand = buildChatGPTCommand({
    previewId,
    modelMode: modelProfile.mode || 'Default',
    manifestHash,
    outfitTitle: outfitTitle || 'Styled Look',
  });

  return res.status(200).json({
    success: true,
    previewId,
    manifestHash,
    chatgptPromptCommand,
    // Board tiles returned for frontend canvas rendering
    boardTiles: {
      model: modelProfile.primary_photo_url || modelProfile.angles?.front,
      products: products.map(p => ({
        role: p.role,
        imageUrl: p.image_url,
        name: p.product_name || p.role,
      })),
    },
  });
}
