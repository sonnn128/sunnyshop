import api from './api';
export const venueApi = {
  async getAll(params) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const response = await api.get(`/venues?${queryParams}`);
    return {
      data: response.data.data || [],
      pagination: response.data.pagination
    };
  },
  async getById(id) {
    const response = await api.get(`/venues/${id}`);
    return response.data.data;
  },
  async create(input) {
    const response = await api.post('/venues', input);
    return response.data.data;
  },
  async update(id, input) {
    const response = await api.put(`/venues/${id}`, input);
    return response.data.data;
  },
  async delete(id) {
    await api.delete(`/venues/${id}`);
  }
};
export const courtApi = {
  async getByVenue(venueId) {
    const response = await api.get(`/courts/venue/${venueId}`);
    return response.data.data || [];
  },
  async create(input) {
    const response = await api.post('/courts', input);
    return response.data.data;
  },
  async update(id, input) {
    const response = await api.put(`/courts/${id}`, input);
    return response.data.data;
  },
  async delete(id) {
    await api.delete(`/courts/${id}`);
  }
};
export default {
  venueApi,
  courtApi
};