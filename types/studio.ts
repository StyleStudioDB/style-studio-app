export type GenerationStatus = 
  | 'queued' | 'pending' | 'processing' | 'completed' 
  | 'partial' | 'repair_required' | 'repairing_products' | 'failed' | 'cancelled';

export type PreviewStatus = 
  | 'pending' | 'processing' | 'completed' | 'failed' 
  | 'cancelled' | 'superseded' | 'historical';

export type ValidationStatus = 
  | 'valid' | 'invalid' | 'verification_blocked' | 'exact_image_missing' 
  | 'retailer_blocked' | 'out_of_stock' | 'role_mismatch' 
  | 'accepted_replacement' | 'rejected_replacement';

export type GarmentRole = 'top' | 'bottom' | 'shoes' | 'outerwear' | 'headwear' | 'accessory';

export interface ModelProfile {
  id: string;
  name: string;
  mode: string;
  headwear_type?: string;
  primary_photo_url?: string;
  angles: {
    front: string | null;
    left: string | null;
    right: string | null;
    back: string | null;
  };
  notes?: string;
  is_active: boolean;
}

export interface OutfitProduct {
  id: string;
  outfit_id: string;
  role: GarmentRole;
  is_wardrobe_item: boolean;
  wardrobe_item_id?: string;
  product_name?: string;
  brand?: string;
  retailer?: string;
  price?: number;
  product_url?: string;
  image_url?: string;
  color?: string;
  is_locked: boolean;
  validation_status: ValidationStatus;
  validation_error_reason?: string;
}

export interface RepairRequest {
  id: string;
  outfit_id: string;
  status: 'pending' | 'processing' | 'partial' | 'completed' | 'failed';
  unresolved_roles: GarmentRole[];
  accepted_replacements: Record<string, OutfitProduct>;
  rejected_replacements: Record<string, OutfitProduct[]>;
  replacement_history: Array<{ timestamp: string; role: GarmentRole; oldUrl?: string; newUrl?: string }>;
}

export interface PreviewRequest {
  id: string;
  outfit_id: string;
  model_profile_id: string;
  status: PreviewStatus;
  manifest_hash: string;
  board_image_url?: string;
  chatgpt_prompt_command?: string;
  completed_image_url?: string;
}
