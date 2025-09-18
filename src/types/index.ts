export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  size: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  description?: string;
  price: number;
  original_price?: number;
  category_id?: number;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  tags: string[];
  images: string[];
  status: 'available' | 'reserved' | 'sold';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_brand: string;
  product_size: string;
  product_condition: string;
  product_price: number;
  product_image?: string;
  added_at: string;
  expires_at: string;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_amount: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  expires_in_minutes: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_brand: string;
  product_size: string;
  product_condition: string;
  product_image?: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  shipping_fee: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  shipping_address: string;
  shipping_phone: string;
  shipping_name: string;
  notes?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  user: User;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  search?: string;
  is_featured?: boolean;
  page?: number;
  per_page?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
