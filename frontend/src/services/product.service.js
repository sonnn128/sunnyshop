import api from '../config/api.js';

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
  },

  // Filter products
  filter: async (params) => {
    try {
      // Params can include: factory (array), target (array), minPrice, maxPrice, keyword, page, size, sortBy, sortDir
      const response = await api.get('/products/filter', { 
        params: params,
        paramsSerializer: {
            indexes: null // to handle array params correctly like factory=Dell&factory=Asus
        }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get all factories
  getFactories: async () => {
    try {
      const response = await api.get('/products/factories');
      return response.data;
    } catch (error) {
       console.error('API Error:', error);
       throw error;
    }
  },
  
  uploadExcel: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
       console.error('API Error:', error);
       throw error;
    }
  },

  downloadTemplate: async () => {
    try {
      const response = await api.get('/products/template', {
        responseType: 'blob', // Important for file download
      });
      return response.data;
    } catch (error) {
       console.error('API Error:', error);
       throw error;
    }
  },

  bulkCreateJSON: async (products) => {
    try {
      const response = await api.post('/products/bulk', products);
      return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
  },

  bulkDelete: async (ids) => {
    try {
      const response = await api.delete('/products/bulk', { data: ids });
      return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
  }
};
