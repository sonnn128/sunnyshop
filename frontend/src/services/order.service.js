import api from '@/config/api';

export const orderService = {
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  getAll: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  getByStatus: async (status, params) => {
    const response = await api.get(`/orders/status/${status}`, { params });
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, null, { params: { status } });
    return response.data;
  }
};
