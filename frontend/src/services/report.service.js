import api from './api';
export const reportApi = {
  async getDashboardStats() {
    const response = await api.get('/reports/dashboard');
    return response.data.data;
  },
  async getRevenueChart(days = 7) {
    const response = await api.get(`/reports/revenue-chart?days=${days}`);
    return response.data.data || [];
  },
  async getMonthlyRevenue() {
    const response = await api.get('/reports/monthly-revenue');
    return response.data.data;
  },
  async getTopCustomers(limit = 10) {
    const response = await api.get(`/reports/top-customers?limit=${limit}`);
    return response.data.data || [];
  },
  async getBookingStatusSummary(venueId) {
    const queryParams = venueId ? `?venueId=${venueId}` : '';
    const response = await api.get(`/reports/booking-status${queryParams}`);
    return response.data.data || [];
  },
  async getUpcomingBookings(limit = 5) {
    const response = await api.get(`/reports/upcoming-bookings?limit=${limit}`);
    return response.data.data || [];
  }
};