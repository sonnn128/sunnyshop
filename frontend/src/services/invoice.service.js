import api from './api';
export const invoiceApi = {
  async getAll(params) {
    const queryParams = new URLSearchParams();
    if (params?.customerId) queryParams.append('customerId', params.customerId);
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const response = await api.get(`/invoices?${queryParams}`);
    return {
      data: response.data.data || [],
      pagination: response.data.pagination
    };
  },
  async getById(id) {
    const response = await api.get(`/invoices/${id}`);
    return response.data.data;
  },
  async create(input) {
    const response = await api.post('/invoices', input);
    return response.data.data;
  },
  async pay(id) {
    const response = await api.post(`/invoices/${id}/pay`);
    return response.data.data;
  },
  async cancel(id, reason) {
    const response = await api.post(`/invoices/${id}/cancel`, {
      reason
    });
    return response.data.data;
  },
  async getDailySummary(date) {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append('date', date);
    const response = await api.get(`/invoices/summary/daily?${queryParams}`);
    return response.data.data;
  }
};
export default invoiceApi;