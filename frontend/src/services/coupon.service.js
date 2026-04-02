import api from '../config/api.js';

export const couponService = {
  // Get all coupons
  getAll: async () => {
    try {
      const response = await api.get('/coupons');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get active coupons
  getActive: async () => {
    try {
      const response = await api.get('/coupons/active');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Create
  create: async (data) => {
    try {
      const response = await api.post('/coupons', data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Update
  update: async (id, data) => {
    try {
      const response = await api.put(`/coupons/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Delete
  delete: async (id) => {
    try {
      const response = await api.delete(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Validate for Checkout
  validate: async (code, orderTotal) => {
    try {
      const response = await api.post('/coupons/validate', null, {
        params: { code, orderTotal }
      });
      return response.data;
    } catch (error) {
      // Return meaningful error instead of throwing globally if possible
      throw error.response?.data?.message || 'Lỗi áp dụng mã';
    }
  }
};
