import axios from 'axios';
import { handleApiError } from './errorHandling';

// Vite exposes env vars through import.meta.env. Use VITE_API_URL as the public variable.
const RAW_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '';
const FALLBACK_BASE = 'http://localhost:4000'; // Sử dụng cổng 4000 cho backend (server default)
export const BASE = RAW_BASE || FALLBACK_BASE;
export const API_URL = BASE; // Không thêm '/api/v1' vì route đã trực tiếp (ví dụ: '/orders')
// If RAW_BASE is empty, consider API disabled in dev unless user runs backend
export const API_ENABLED = true; // Luôn bật API để đảm bảo kết nối

const API = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});
API.defaults.withCredentials = true; // send cookies (httpOnly token) to backend

API.interceptors.request.use((config) => {
  try {
    // safe access to localStorage in browser environment
    const token = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('token') : null;
    if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  } catch (e) {
    // ignore in non-browser environments
  }
  return config;
});

/**
 * Get all orders with pagination and filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of items per page
 * @param {string} params.sort - Sort criteria (e.g., '-createdAt' for descending by date)
 * @param {string} params.status - Filter by status
 * @param {string} params.userId - Filter by user ID
 * @returns {Promise<Object>} - Order data with pagination info
 */
export const getOrders = async (params = {}) => {
  try {
    const response = await API.get('/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get order by ID
 * @param {string} orderId - The ID of the order to retrieve
 * @returns {Promise<Object>} - Order data
 */
export const getOrderById = async (orderId) => {
  try {
    console.log(`Calling API to fetch order: ${BASE}/orders/${orderId}`);
    const response = await API.get(`/orders/${orderId}`);
    console.log('Order API response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - The ID of the order to update
 * @param {string} status - New status value
 * @returns {Promise<Object>} - Updated order data
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await API.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
};

/**
 * Get order statistics 
 * @returns {Promise<Object>} - Order statistics
 */
export const getOrderStats = async () => {
  try {
    const response = await API.get('/orders/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw error;
  }
};

/**
 * Delete order
 * @param {string} orderId - The ID of the order to delete
 * @returns {Promise<Object>} - Response data
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await API.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Get order items for a specific order
 * @param {string} orderId - The ID of the order
 * @returns {Promise<Array>} - Array of order items with product details
 */
export const getOrderItems = async (orderId) => {
  try {
    // Try to get from order items endpoint first
    try {
      const response = await API.get(`/order-items?order_id=${orderId}`);
      if (response.data && response.data.items) {
        return response.data.items;
      }
    } catch (e) {
      console.log('Order items endpoint not available, will use order details');
    }
    
    // Fallback: get from order with details
    const order = await getOrderById(orderId);
    if (order && order.items) {
      return order.items;
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching order items for ${orderId}:`, error);
    return [];
  }
};

export default API;

/**
 * COUPONS API FUNCTIONS
 */

/**
 * Get available coupons for user
 * @returns {Promise<Object>} - Coupons data
 */
export const getUserCoupons = async () => {
  try {
    const response = await API.get('/coupons/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user coupons:', error);
    throw error;
  }
};

/**
 * Validate coupon code
 * @param {string} code - Coupon code
 * @param {number} orderAmount - Order amount
 * @returns {Promise<Object>} - Validation result
 */
export const validateCoupon = async (code, orderAmount) => {
  try {
    const response = await API.get(`/coupons/validate/${code}`, {
      params: { orderAmount }
    });
    return response.data;
  } catch (error) {
    console.error(`Error validating coupon ${code}:`, error);
    throw error;
  }
};

/**
 * Get all coupons (admin)
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Coupons data
 */
export const getCoupons = async (params = {}) => {
  try {
    const response = await API.get('/coupons', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

/**
 * Create coupon (admin)
 * @param {Object} couponData - Coupon data
 * @returns {Promise<Object>} - Created coupon
 */
export const createCoupon = async (couponData) => {
  try {
    const response = await API.post('/coupons', couponData);
    return response.data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
};

/**
 * Update coupon (admin)
 * @param {string} couponId - Coupon ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} - Updated coupon
 */
export const updateCoupon = async (couponId, updateData) => {
  try {
    const response = await API.put(`/coupons/${couponId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating coupon ${couponId}:`, error);
    throw error;
  }
};

/**
 * Delete coupon (admin)
 * @param {string} couponId - Coupon ID
 * @returns {Promise<Object>} - Response data
 */
export const deleteCoupon = async (couponId) => {
  try {
    const response = await API.delete(`/coupons/${couponId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting coupon ${couponId}:`, error);
    throw error;
  }
};

// ==================== CHAT API ====================

/**
 * Get customer conversation
 * @returns {Promise<Object>} - Conversation data
 */
export const getCustomerConversation = async () => {
  try {
    const response = await API.get('/chat/conversation');
    return response.data;
  } catch (error) {
    console.error('Error fetching customer conversation:', error);
    throw error;
  }
};

/**
 * Get messages for a conversation
 * @param {string} conversationId - Conversation ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Messages data
 */
export const getMessages = async (conversationId, params = {}) => {
  try {
    const response = await API.get(`/chat/messages/${conversationId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send a message
 * @param {Object} messageData - Message data
 * @param {string} messageData.conversationId - Conversation ID
 * @param {string} messageData.message - Message content
 * @param {string} messageData.messageType - Message type (text, image, file)
 * @returns {Promise<Object>} - Response data
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await API.post('/chat/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Mark messages as read
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} - Response data
 */
export const markMessagesAsRead = async (conversationId) => {
  try {
    const response = await API.patch(`/chat/messages/${conversationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// ==================== RECOMMENDATIONS API ====================

/**
 * Get product recommendations
 * @param {Object} params - Query parameters
 * @param {string} params.userId - User ID for personalized recommendations
 * @param {string} params.productId - Product ID for related products
 * @param {number} params.limit - Number of recommendations to return
 * @returns {Promise<Object>} - Recommendations data
 */
export const getRecommendations = async (params = {}) => {
  try {
    const response = await API.get('/api/recommendations', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

/**
 * Get trending products
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Number of trending products to return
 * @returns {Promise<Object>} - Trending products data
 */
export const getTrendingProducts = async (params = {}) => {
  try {
    const response = await API.get('/api/recommendations/trending', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    throw error;
  }
};

/**
 * Subscribe to email newsletter
 * @param {Object} subscriptionData - Subscription data
 * @param {string} subscriptionData.email - Email address
 * @param {Array<string>} subscriptionData.preferences - Email preferences
 * @returns {Promise<Object>} - Subscription result
 */
export const subscribeEmail = async (subscriptionData) => {
  try {
    const response = await API.post('/email/subscribe', subscriptionData);
    return response.data;
  } catch (error) {
    console.error('Error subscribing to email:', error);
    throw error;
  }
};
