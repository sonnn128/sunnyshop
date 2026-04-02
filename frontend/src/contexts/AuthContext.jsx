import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import api, { authApi } from '../config/api.js';
import tokenService from '../utils/tokenService.js';
import { isAdmin as isAdminFromJWT, getTokenInfo } from '../utils/jwt.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(tokenService.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = tokenService.getToken();
  const savedUser = tokenService.getUser();
    
    if (token) {
      // Try to get user from localStorage first (faster)
      if (savedUser) {
        setUser(savedUser);
        setLoading(false);
      }
      
      // Then verify with API
      api.get('/auth/profile')
        .then(response => {
          const userData = response.data.data || response.data;
          setUser(userData);
          tokenService.setUser(userData);
        })
        .catch((error) => {
          console.error('API profile error:', error);
          // Don't remove token immediately, might be network issue
          // Only remove if it's 401 unauthorized
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const responseData = response.data.data || response.data;
      const { token, refreshToken, user: userData } = responseData;

      console.log('Login response:', { responseData, userData, token });

      tokenService.setToken(token);
      if (refreshToken) tokenService.setRefreshToken(refreshToken);
      tokenService.setUser(userData);
      setUser(userData);

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    // inform backend to invalidate refresh tokens (best-effort)
    try {
      await api.post('/auth/logout').catch(() => {});
    } catch (e) {
      // ignore
    }
    tokenService.clearTokens();
    tokenService.setUser(null);
    setUser(null);
  };

  const tryRefresh = async () => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) return false;
    try {
      const resp = await authApi.post('/auth/refresh', { refreshToken });
      const data = resp.data.data || resp.data;
      const newToken = data.token || data.accessToken || data;
      if (newToken) {
        tokenService.setToken(newToken);
        return true;
      }
      return false;
    } catch (e) {
      tokenService.clearTokens();
      tokenService.setUser(null);
      setUser(null);
      return false;
    }
  };

  const isAdmin = () => {
    // First check JWT token for authorities
    const token = localStorage.getItem('token');
    if (token) {
      const tokenInfo = getTokenInfo(token);
      console.log('JWT token info:', tokenInfo);
      
      if (tokenInfo) {
        const hasAdminAuthority = isAdminFromJWT(token);
        console.log('JWT authorities check:', { 
          authorities: tokenInfo.authorities, 
          hasAdminAuthority,
          isExpired: tokenInfo.isExpired 
        });
        
        // Only return true if token is not expired and has ADMIN authority
        if (!tokenInfo.isExpired && hasAdminAuthority) {
          return true;
        }
      }
    }
    
    // Fallback: Check if user has ADMIN role
    if (!user) return false;
    
    // Check if user has roles array and ADMIN role
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.some(role => role.name === 'ADMIN' || role.name === 'ROLE_ADMIN');
    }
    
    // Fallback: check if user.role is ADMIN (single role)
    if (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') {
      return true;
    }
    
    // Fallback: check if username is admin (for testing)
    if (user.username === 'admin') {
      return true;
    }
    
    return false;
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    tryRefresh,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
