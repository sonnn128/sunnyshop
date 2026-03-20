import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist(set => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  login: (user, accessToken, refreshToken) => {
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true
    });
  },
  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    });
  },
  updateTokens: (accessToken, refreshToken) => {
    set({
      accessToken,
      refreshToken
    });
  }
}), {
  name: 'courtify-auth',
  partialize: state => ({
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    isAuthenticated: state.isAuthenticated
  })
}));