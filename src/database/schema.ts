// Funko condition options
export type FunkoCondition = "mint" | "near_mint" | "good" | "fair" | "poor";

// Standard Funko sizes based on figure height
export type FunkoSize = "standard" | "super_sized" | "jumbo";

// Common Funko Pop product line variants
export type FunkoType =
  | "standard_pop"
  | "pop_ride"
  | "pop_town"
  | "pop_moment"
  | "pop_album"
  | "pop_comic_cover"
  | "pop_deluxe"
  | "pop_2pack"
  | "pop_3pack"
  | "pop_keychain"
  | "pop_tee"
  | "soda"
  | "vinyl_gold"
  | "other";

// Special Funko variant finishes and editions
export type FunkoVariant =
  | "normal"
  | "chase"
  | "chrome"
  | "flocked"
  | "glow_in_the_dark"
  | "metallic"
  | "translucent"
  | "glitter"
  | "blacklight"
  | "diamond"
  | "scented"
  | "exclusive"
  | "limited_edition"
  | "other";

export interface Funko {
  id: string;
  name: string;
  series?: string;
  number: string;
  category?: string;
  condition: FunkoCondition;
  size?: FunkoSize; // Default: "standard" (3.75" figure)
  type?: FunkoType; // Default: "standard_pop"
  variant?: FunkoVariant; // Default: "normal"
  purchase_price?: number | null;
  current_value?: number | null;
  purchase_date?: string | null;
  notes?: string;
  has_protector_case?: boolean;
  image_paths?: string[];
  created_at: string;
  updated_at: string;
}

export interface FunkoCollection {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FunkoCollectionItem {
  collection_id: string;
  funko_id: string;
  added_at: string;
}
