import type { NextApiRequest, NextApiResponse } from 'next';
import { validateProduct, createRoleLockedRepair } from '../../lib/validator';
import { OutfitProduct } from '../../types/studio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { outfitId, products } = req.body as { outfitId: string; products: OutfitProduct[] };

  if (!outfitId || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Missing required parameters: outfitId and products.' });
  }

  const validationResults = new Map();

  // Validate each product in the outfit
  for (const product of products) {
    const result = await validateProduct(product);
    validationResults.set(product.id, result);
  }

  // Generate the role-locked repair manifest
  const repairManifest = createRoleLockedRepair(outfitId, products, validationResults);

  return res.status(200).json({
    success: true,
    repairManifest
  });
}
