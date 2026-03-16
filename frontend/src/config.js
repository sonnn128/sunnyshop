/**
 * Global application configuration
 */

// API base URL for all requests
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Order status options
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Payment methods
export const PAYMENT_METHODS = {
  COD: 'cod', // Cash on delivery
  BANK_TRANSFER: 'bank_transfer',
  MOMO: 'momo', 
  VNPAY: 'vnpay',
  ZALOPAY: 'zalopay'
};

// User roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager'
};

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_REVIEWS: true,
  ENABLE_WISHLIST: true,
  ENABLE_COMPARE: true
};

// App theme settings
export const THEME = {
  COLOR_PRIMARY: '#2563eb',
  COLOR_SECONDARY: '#0f172a',
  COLOR_ACCENT: '#8b5cf6',
  COLOR_SUCCESS: '#10b981',
  COLOR_WARNING: '#f59e0b',
  COLOR_ERROR: '#ef4444'
};