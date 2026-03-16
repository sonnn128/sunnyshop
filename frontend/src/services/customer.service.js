import api from './api';
export const customerApi = {
  async getAll(params) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.membershipTier) queryParams.append('membershipTier', params.membershipTier);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const response = await api.get(`/customers?${queryParams}`);
    return {
      data: response.data.data || [],
      pagination: response.data.pagination
    };
  },
  async getById(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
  },
  async create(input) {
    const response = await api.post('/customers', input);
    return response.data.data;
  },
  async update(id, input) {
    const response = await api.put(`/customers/${id}`, input);
    return response.data.data;
  },
  async delete(id) {
    await api.delete(`/customers/${id}`);
  },
  async searchByPhone(phone) {
    const response = await api.get(`/customers/search?phone=${phone}`);
    return response.data.data || null;
  },
  async addPoints(id, points) {
    const response = await api.post(`/customers/${id}/points`, {
      points
    });
    return response.data.data;
  }
};
export default customerApi;