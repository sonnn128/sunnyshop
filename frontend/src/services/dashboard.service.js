import api from '../config/api.js';

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get recent orders
  getRecentOrders: async (limit = 5) => {
    try {
      const response = await api.get('/admin/dashboard/recent-orders', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get top products
  getTopProducts: async (limit = 5) => {
    try {
      const response = await api.get('/admin/dashboard/top-products', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
