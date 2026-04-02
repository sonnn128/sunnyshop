import api from '../config/api.js';

// Products API
export const productService = {
  // Get all products
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get product by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Create new product
  create: async (productData) => {
    try {
      const config = {};
      if (productData instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await api.post('/products', productData, config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      const config = {};
      if (productData instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await api.put(`/products/${id}`, productData, config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Categories API
export const categoryService = {
  // Get all categories
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Create new category
  create: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Update category
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Orders API
export const orderService = {
  // Get all orders with pagination
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get all orders without pagination
  getAllWithoutPagination: async () => {
    try {
      const response = await api.get('/orders/all');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get orders by status
  getByStatus: async (status, params = {}) => {
    try {
      const response = await api.get(`/orders/status/${status}`, { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get order by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Update order status
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Users API
export const userService = {
  // Get all users
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Create new user
  create: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Search users
  search: async (keyword, role, params = {}) => {
    try {
      const response = await api.get('/users/search', { 
        params: { keyword, role, ...params } 
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Dashboard API
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

// Settings API
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
