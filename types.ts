
// Matching public.items
export interface Item {
  id: string;
  title: string;
  price: number | null;
  original_price?: number;
  discount_percent?: number;
  description?: string;
  images: string[];
  location_id?: string;
  category_id?: number;
  condition: 'new' | 'used_good' | 'used_fair' | 'refurbished';
  status: 'draft' | 'public' | 'sold' | 'archived';
  created_at: string;
  views_count: number;
  favorites_count: number;
  is_verified: boolean;
  seller_id: string;
  tags: string[];
  attributes?: Record<string, any>;
  quantity: number;
  reserved_quantity: number;
  sku?: string;
}

// Matching public.categories
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string; // Using lucide-react icon names
  parent_id?: number | null;
}

// Matching public.locations
export interface Location {
  id: string;
  city: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

// Matching public.profiles
export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  seller_rating: number;
  total_reviews: number;
  is_verified: boolean;
  joined_at: string;
  about?: string;
  cover_url?: string;
  subscription_tier?: 'free' | 'base' | 'business' | 'custom';
  email?: string;
  password?: string;
}

// Matching public.buyer_requests
export interface BuyerRequest {
  id: string;
  buyer_id: string;
  item_id: string; // inferred relation
  status: 'pending' | 'accepted' | 'declined' | 'sold';
  message: string;
  preferred_contact: 'chat' | 'phone' | 'email';
  contact_info?: string;
  offer_price?: number;
  created_at: string;
  buyer_name?: string; // Joined field
  item_title?: string; // Joined field
  item_image?: string; // Joined field
}

// Matching public.warehouses & storage_zones
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: 'main' | 'reserve' | 'retail';
  capacity_volume?: number;
  occupancy_percentage?: number; // Calculated
  zones: StorageZone[];
}

export interface StorageZone {
  id: string;
  name: string;
  code: string;
  type: 'bulk' | 'rack' | 'bin';
  bins_count: number;
}

// Matching public.item_batches
export interface ItemBatch {
  id: string;
  item_id: string;
  batch_number: string;
  supplier_id?: string;
  expiration_date?: string;
  quantity_received: number;
  quantity_available: number;
  received_date: string;
  status: 'active' | 'depleted' | 'expired';
}

// Matching public.inventory_movements
export interface InventoryMovement {
  id: string;
  item_id: string;
  location_from_id?: string;
  location_to_id?: string;
  user_id: string;
  movement_type: 'inbound' | 'outbound' | 'transfer' | 'adjustment' | 'audit_correction';
  quantity: number;
  notes?: string;
  created_at: string;
}

// Stock Audit (Inventory Count)
export interface StockAudit {
  id: string;
  reference_number: string;
  warehouse_id?: string;
  created_at: string;
  completed_at?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  items: StockAuditItem[];
  notes?: string;
}

export interface StockAuditItem {
  item_id: string;
  expected_qty: number;
  actual_qty: number | null;
  discrepancy: number;
}

// For AI Search Response
export interface SmartSearchFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  keywords?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'relevance';
}

// User Stories
export interface Story {
  id: string;
  seller_id: string;
  image_url: string;
  title: string;
  description?: string;
  item_id?: string; // Optional link to a specific item
  expires_at: string;
  is_seen?: boolean;
}

// Ultimate Filters State
export interface FilterState {
  minPrice: string;
  maxPrice: string;
  locationId: string;
  condition: string[];
  verifiedOnly: boolean;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'relevance';
}

// Notifications
export interface Notification {
  id: string;
  type: 'system' | 'price_drop' | 'message' | 'story_like' | 'order_update';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
  image_url?: string;
}
