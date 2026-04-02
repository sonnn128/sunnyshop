import axios from 'axios';

// API Configuration
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// A separate axios instance for auth endpoints (refresh) to avoid interceptor loops
const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility to attach access token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Allow browser to set Content-Type for FormData (multipart/form-data + boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh logic: queue requests while refresh is in progress
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

// Response interceptor - try to refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401, reject directly
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // If originalRequest._retry is set, it means we've already retried once
    if (originalRequest._retry) {
      // second failure -> logout
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Start refresh flow
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Nothing to do, force logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const resp = await authApi.post('/auth/refresh', { refreshToken });
        const data = resp.data.data || resp.data;
        const newToken = data.token || data.accessToken || data;
        if (newToken) {
          localStorage.setItem('token', newToken);
          onRefreshed(newToken);
        } else {
          // Unexpected response, clear and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshErr) {
        // Refresh failed: clear storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Queue the requests and retry after refresh completes
    return new Promise((resolve, reject) => {
      addRefreshSubscriber((newToken) => {
        // Update the authorization header and retry the request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        originalRequest._retry = true;
        resolve(api(originalRequest));
      });
    });
  }
);

export { authApi };
export default api;
