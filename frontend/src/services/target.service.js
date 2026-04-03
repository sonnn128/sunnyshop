import api from '../config/api.js';

export const targetService = {
  // Get all targets
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/targets', { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get target by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/targets/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Create new target
  create: async (targetData) => {
    try {
      const response = await api.post('/targets', targetData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Update target
  update: async (id, targetData) => {
    try {
      const response = await api.put(`/targets/${id}`, targetData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Delete target
  delete: async (id) => {
    try {
      const response = await api.delete(`/targets/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
