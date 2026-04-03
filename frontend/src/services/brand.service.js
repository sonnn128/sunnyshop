import api from '../config/api.js';

export const brandService = {
  // Get all brands
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/brands', { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get brand by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/brands/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Create new brand
  create: async (brandData) => {
    try {
      const response = await api.post('/brands', brandData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Update brand
  update: async (id, brandData) => {
    try {
      const response = await api.put(`/brands/${id}`, brandData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Delete brand
  delete: async (id) => {
    try {
      const response = await api.delete(`/brands/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
