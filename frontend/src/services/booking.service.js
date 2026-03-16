import api from './api';

// Types

// API functions
export const bookingApi = {
  // Get calendar data for a venue
  async getCalendarData(venueId, startDate, endDate) {
    const response = await api.get(`/bookings/calendar/${venueId}?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },
  // Check availability
  async checkAvailability(courtId, date, startTime, endTime) {
    const response = await api.get(`/bookings/check-availability?courtId=${courtId}&date=${date}&startTime=${startTime}&endTime=${endTime}`);
    return response.data.data;
  },
  // Calculate price
  async calculatePrice(courtId, date, startTime, endTime) {
    const response = await api.get(`/bookings/calculate-price?courtId=${courtId}&date=${date}&startTime=${startTime}&endTime=${endTime}`);
    return response.data.data;
  },
  // Create booking
  async create(input) {
    const response = await api.post('/bookings', input);
    return response.data.data;
  },
  // Update booking
  async update(id, input) {
    const response = await api.put(`/bookings/${id}`, input);
    return response.data.data;
  },
  // Cancel booking
  async cancel(id, reason) {
    const response = await api.post(`/bookings/${id}/cancel`, {
      reason
    });
    return response.data.data;
  },
  // Check-in
  async checkIn(id) {
    const response = await api.post(`/bookings/${id}/check-in`);
    return response.data.data;
  },
  // Check-out
  async checkOut(id) {
    const response = await api.post(`/bookings/${id}/check-out`);
    return response.data.data;
  },
  // Get single booking
  async getById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data;
  }
};
export default bookingApi;