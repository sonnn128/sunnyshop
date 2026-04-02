
// d:\sunnyshop\frontend\src\services\auth.service.js
import api from '@/config/api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  forgotPassword: async (email) => {
     const response = await api.post('/auth/forgot-password', { email });
     return response.data;
  },

  verifyOtp: async (otp, username) => {
     const response = await api.post('/auth/verify-otp', { otp, username });
     return response.data;
  },
  
  resetPassword: async (token, newPassword) => {
     const response = await api.post('/auth/reset-password', { token, newPassword });
     return response.data;
  }
};
