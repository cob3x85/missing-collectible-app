export interface Funko {
  id: string;
  name: string;
  series?: string;
  number: string;
  category?: string;
  condition: "mint" | "near_mint" | "good" | "fair" | "poor";
  purchase_price?: number;
  current_value?: number;
  purchase_date?: string;
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
