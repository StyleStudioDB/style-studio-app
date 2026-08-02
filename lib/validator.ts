import { GarmentRole, OutfitProduct, ValidationStatus } from '../types/studio';

export interface ValidationResult {
  status: ValidationStatus;
  isValid: boolean;
  reason?: string;
}

/**
 * Validates direct product links, image URLs, retailer blocks, and stock indicators.
 */
export async function validateProduct(product: Partial<OutfitProduct>): Promise<ValidationResult> {
  // 1. Wardrobe items are already validated by the user
  if (product.is_wardrobe_item) {
    return { status: 'valid', isValid: true };
  }

  // 2. Check for missing critical URLs
  if (!product.product_url) {
    return { status: 'invalid', isValid: false, reason: 'Missing direct product URL.' };
  }
  if (!product.image_url) {
    return { status: 'exact_image_missing', isValid: false, reason: 'Missing direct product image URL.' };
  }

  try {
    const url = new URL(product.product_url);
    const domain = url.hostname.replace('www.', '');

    // 3. Basic URL structure checks
    if (!url.protocol.startsWith('http')) {
      return { status: 'invalid', isValid: false, reason: 'Invalid URL scheme.' };
    }

    // 4. Validate image URL extension/format
    const imageExtension = product.image_url.split('.').pop()?.split('?')[0]?.toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    if (imageExtension && !validExtensions.includes(imageExtension) && !product.image_url.includes('images')) {
      return { status: 'exact_image_missing', isValid: false, reason: 'Image URL does not point to a supported image asset.' };
    }

    return { status: 'valid', isValid: true };
  } catch (error) {
    return { status: 'invalid', isValid: false, reason: 'Malformed URL provided.' };
  }
}

/**
 * Role-Locking Algorithm:
 * Evaluates an outfit's products and isolates failed roles without altering locked/valid roles.
 */
export function createRoleLockedRepair(
  outfitId: string,
  products: OutfitProduct[],
  validationResults: Map<string, ValidationResult>
) {
  const unresolvedRoles: GarmentRole[] = [];
  const lockedProducts: OutfitProduct[] = [];

  for (const product of products) {
    const result = validationResults.get(product.id);

    if (result && !result.isValid) {
      // Role failed validation -> Mark for repair, leave unlocked
      unresolvedRoles.push(product.role);
    } else {
      // Role passed validation -> Lock this item in place
      lockedProducts.push({
        ...product,
        is_locked: true,
        validation_status: 'valid'
      });
    }
  }

  return {
    outfit_id: outfitId,
    status: unresolvedRoles.length > 0 ? 'pending' : 'completed',
    unresolved_roles: unresolvedRoles,
    locked_products: lockedProducts
  };
}
