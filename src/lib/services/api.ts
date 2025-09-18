import axios from 'axios';
import { Product, ProductListResponse, User, Cart, Order, ProductFilter } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get full image URL
export const getImageUrl = (filename: string | null | undefined, type: 'blog' | 'products' = 'blog'): string | null => {
  if (!filename) return null;
  // If it's already a full URL, return as is
  if (filename.startsWith('http')) return filename;
  // If it already contains uploads path, just prepend API_BASE_URL
  if (filename.startsWith('/uploads/')) return `${API_BASE_URL}${filename}`;
  // Otherwise, construct the full URL based on type
  return `${API_BASE_URL}/uploads/${type}/${filename}`;
};

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log 400 errors for cart operations (thrift shop logic)
    if (error.response?.status === 400 && 
        error.config?.url?.includes('/cart/add')) {
      // This is expected behavior for thrift shop, don't log as error
      return Promise.reject(error);
    }
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/auth/login';
      }
    }
    
    // Log other errors normally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  product_count: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string;
  status: string;
  author: string;
  featured_image?: string;
  views: number;
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

// Auth API
export const authAPI = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', 
      new URLSearchParams({ username: email, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return response.data;
  },

  async register(userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    address?: string;
  }) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(userData: Partial<User>) {
    const response = await api.put('/auth/me', userData);
    return response.data;
  }
};

// Products API
export const productsAPI = {
  async getProducts(filters?: ProductFilter): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/products/?${params.toString()}`);
    return response.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get('/products/featured');
    return response.data;
  },

  async getProduct(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(product: Partial<Product>) {
    const response = await api.post('/products/', product);
    return response.data;
  },

  async updateProduct(id: number, product: Partial<Product>) {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async uploadProductImages(id: number, formData: FormData) {
    const response = await api.post(`/products/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteProductImage(id: number, imageIndex: number) {
    const response = await api.delete(`/products/${id}/images/${imageIndex}`);
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/products/categories');
    return response.data;
  },

  async createCategory(data: { name: string; description?: string }) {
    const response = await api.post('/products/categories', data);
    return response.data;
  }
};

// Cart API
export const cartAPI = {
  async getCart(): Promise<Cart> {
    const response = await api.get('/cart/');
    return response.data;
  },

  async addToCart(productId: number, quantity: number = 1) {
    const response = await api.post('/cart/add', { product_id: productId, quantity });
    return response.data;
  },

  async updateCartItem(itemId: number, quantity: number) {
    const response = await api.put(`/cart/update/${itemId}?quantity=${quantity}`);
    return response.data;
  },

  async removeFromCart(itemId: number) {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  async extendCartHold() {
    const response = await api.post('/cart/extend-hold');
    return response.data;
  },

  async getCartHoldStatus() {
    const response = await api.get('/cart/hold-status');
    return response.data;
  }
};

// Orders API
export const ordersAPI = {
  async getOrders(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    user_id?: number;
  }): Promise<Order[]> {
    const response = await api.get('/orders/', { params });
    return response.data;
  },

  async getOrder(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async createOrder(orderData: {
    shipping_address: string;
    shipping_phone: string;
    shipping_name: string;
    payment_method: string;
    notes?: string;
    items: Array<{ product_id: number; quantity: number; price: number }>;
  }): Promise<Order> {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },

  async updateOrder(id: number, data: {
    status?: string;
    tracking_number?: string;
    notes?: string;
  }) {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  async getOrderStats() {
    const response = await api.get('/orders/stats/summary');
    return response.data;
  }
};

// Users API
export const usersAPI = {
  async getUsers(params?: {
    skip?: number;
    limit?: number;
    role?: string;
    is_active?: boolean;
    search?: string;
  }): Promise<User[]> {
    const response = await api.get('/users/', { params });
    return response.data;
  },

  async getUser(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: number, data: Partial<User>) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async changeUserRole(id: number, role: string) {
    const response = await api.put(`/users/${id}/role`, null, {
      params: { new_role: role }
    });
    return response.data;
  },

  async activateUser(id: number) {
    const response = await api.put(`/users/${id}/activate`);
    return response.data;
  },

  async deactivateUser(id: number) {
    const response = await api.put(`/users/${id}/deactivate`);
    return response.data;
  },

  async getUserStats() {
    const response = await api.get('/users/stats/summary');
    return response.data;
  }
};

// Blog API
export const blogAPI = {
  async getBlogPosts(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<BlogPost[]> {
    const response = await api.get('/blog/', { params });
    return response.data;
  },

  async getFeaturedPosts(limit?: number): Promise<BlogPost[]> {
    const response = await api.get('/blog/featured', {
      params: { limit }
    });
    return response.data;
  },

  async getBlogPost(id: number): Promise<BlogPost> {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    const response = await api.get(`/blog/slug/${slug}`);
    return response.data;
  },

  async createBlogPost(data: Partial<BlogPost>) {
    const response = await api.post('/blog/', data);
    return response.data;
  },

  async updateBlogPost(id: number, data: Partial<BlogPost>) {
    const response = await api.put(`/blog/${id}`, data);
    return response.data;
  },

  async deleteBlogPost(id: number) {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  },

  async uploadFeaturedImage(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/blog/${id}/featured-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getBlogCategories(): Promise<string[]> {
    const response = await api.get('/blog/categories/list');
    return response.data;
  },

  async getBlogStats() {
    const response = await api.get('/blog/stats/summary');
    return response.data;
  }
};

// Notifications API
export const notificationsAPI = {
  async getNotifications(params?: {
    skip?: number;
    limit?: number;
  }): Promise<Notification[]> {
    const response = await api.get('/notifications/', { params });
    return response.data;
  },

  async getUserNotifications(params?: {
    skip?: number;
    limit?: number;
  }): Promise<Notification[]> {
    const response = await api.get('/notifications/user', { params });
    return response.data;
  },

  async createNotification(data: {
    title: string;
    message: string;
    type?: string;
    send_email?: boolean;
  }) {
    const response = await api.post('/notifications/', data);
    return response.data;
  },

  async sendEmailNotification(data: {
    title: string;
    message: string;
  }) {
    const response = await api.post('/notifications/send-email', data);
    return response.data;
  },

  async getNotificationStats() {
    const response = await api.get('/notifications/stats/summary');
    return response.data;
  },

  async subscribeToNotifications(email: string, categories: string[]) {
    const response = await api.post('/notifications/subscribe', {
      email,
      categories
    });
    return response.data;
  }
};

// Settings API
export const settingsAPI = {
  async getSettings() {
    const response = await api.get('/settings/');
    return response.data;
  },

  async updateSettings(settings: any) {
    const response = await api.put('/settings/', { settings });
    return response.data;
  },

  async resetSettings() {
    const response = await api.post('/settings/reset');
    return response.data;
  },

  async exportSettings() {
    const response = await api.get('/settings/export');
    return response.data;
  },

  async importSettings(settings: any) {
    const response = await api.post('/settings/import', { settings });
    return response.data;
  }
};

export default api;
