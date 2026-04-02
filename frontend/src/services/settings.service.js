import api from '../config/api.js';

export const settingsService = {
  // Get settings
  get: async () => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Update settings
  update: async (settings) => {
    try {
      const response = await api.put('/admin/settings', settings);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
