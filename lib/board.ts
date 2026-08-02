import { ModelProfile, OutfitProduct } from '../types/studio';

export interface ManifestData {
  modelId: string;
  outfitId: string;
  items: Array<{ role: string; url: string | undefined }>;
  timestamp: string;
}

/**
 * Calculates a SHA-256 manifest hash to freeze model and garment fidelity.
 */
export async function calculateManifestHash(manifest: ManifestData): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(manifest));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates the precise command prompt to paste into ChatGPT alongside the board.
 */
export function buildChatGPTCommand(params: {
  previewId: string;
  modelMode: string;
  manifestHash: string;
  outfitTitle: string;
}): string {
  const { previewId, modelMode, manifestHash, outfitTitle } = params;

  return `[Style Studio Preview Request]
Preview ID: ${previewId}
Model Mode: ${modelMode}
Manifest Hash: ${manifestHash}
Outfit Target: ${outfitTitle}

INSTRUCTIONS FOR GPT:
1. Preserve the identity, face, beard, skin tone, and physical structure from the reference model tile exactly.
2. Render the subject wearing ALL attached garment tiles: Top, Bottom, Shoes, Headwear (${modelMode}), and Outerwear/Accessories if present.
3. Lock footwear and headwear styles to match the reference tiles without alteration.
4. Output a photorealistic, full-body preview maintaining 100% garment fidelity.`;
}
