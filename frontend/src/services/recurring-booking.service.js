import api from './api';
export const recurringBookingApi = {
  async create(data) {
    const response = await api.post('/recurring-bookings', data);
    return response.data;
  },
  async getAll(customerId) {
    const params = customerId ? `?customerId=${customerId}` : '';
    const response = await api.get(`/recurring-bookings${params}`);
    return response.data.data || [];
  },
  async getById(groupId) {
    const response = await api.get(`/recurring-bookings/${groupId}`);
    return response.data.data;
  },
  async updateTime(groupId, startTime, endTime, updateFutureOnly = true) {
    const response = await api.patch(`/recurring-bookings/${groupId}/time`, {
      startTime,
      endTime,
      updateFutureOnly
    });
    return response.data;
  },
  async cancel(groupId, futureOnly = true) {
    const response = await api.delete(`/recurring-bookings/${groupId}?futureOnly=${futureOnly}`);
    return response.data;
  }
};