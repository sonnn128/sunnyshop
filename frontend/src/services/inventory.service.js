import api from './api';
// Product API
export const productApi = {
  async getAll(params) {
    const queryParams = new URLSearchParams();
    if (params?.venueId) queryParams.append('venueId', params.venueId);
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const response = await api.get(`/products?${queryParams}`);
    return {
      data: response.data.data || [],
      pagination: response.data.pagination
    };
  },
  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },
  async create(input) {
    const response = await api.post('/products', input);
    return response.data.data;
  },
  async update(id, input) {
    const response = await api.put(`/products/${id}`, input);
    return response.data.data;
  },
  async updateStock(id, quantity, type) {
    const response = await api.patch(`/products/${id}/stock`, {
      quantity,
      type
    });
    return response.data.data;
  },
  async delete(id) {
    await api.delete(`/products/${id}`);
  },
  async getLowStock(venueId, threshold) {
    const queryParams = new URLSearchParams();
    if (venueId) queryParams.append('venueId', venueId);
    if (threshold) queryParams.append('threshold', String(threshold));
    const response = await api.get(`/products/low-stock?${queryParams}`);
    return response.data.data || [];
  }
};

// Service API
export const serviceApi = {
  async getAll(params) {
    const queryParams = new URLSearchParams();
    if (params?.venueId) queryParams.append('venueId', params.venueId);
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const response = await api.get(`/services?${queryParams}`);
    return {
      data: response.data.data || [],
      pagination: response.data.pagination
    };
  },
  async getById(id) {
    const response = await api.get(`/services/${id}`);
    return response.data.data;
  },
  async create(input) {
    const response = await api.post('/services', input);
    return response.data.data;
  },
  async update(id, input) {
    const response = await api.put(`/services/${id}`, input);
    return response.data.data;
  },
  async delete(id) {
    await api.delete(`/services/${id}`);
  }
};