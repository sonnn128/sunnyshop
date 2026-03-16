import api from './api';
export const authService = {
  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  async logout(refreshToken) {
    await api.post('/auth/logout', {
      refreshToken
    });
  },
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },
  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },
  async logoutAllDevices() {
    const response = await api.post('/auth/logout-all');
    return response.data;
  }
};