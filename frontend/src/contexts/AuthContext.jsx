import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../lib/api';

// Tạo context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra token trong localStorage
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Parse thông tin user
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Make auth status globally available for non-React code
          window.getAuthStatus = () => true;
          window.getUser = () => userData;
          
          // Kiểm tra token hợp lệ (tùy chọn)
          // Trong thực tế, bạn có thể thêm API call để validate token
          // await API.get('/api/auth/validate');
        } catch (e) {
          console.error('Error parsing stored user data:', e);
          // Reset nếu dữ liệu không hợp lệ
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          
          // Update global status
          window.getAuthStatus = () => false;
          window.getUser = () => null;
        }
      } else {
        // Not authenticated
        window.getAuthStatus = () => false;
        window.getUser = () => null;
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      window.getAuthStatus = () => false;
      window.getUser = () => null;
    } finally {
      setLoading(false);
    }
  };
  
  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Hàm đăng nhập
  const login = async (credentials) => {
    try {
      // Trong thực tế, đây sẽ là API call đến server
      // const response = await API.post('/api/auth/login', credentials);
      // const { user, token } = response.data;
      
      // Demo: Giả lập đăng nhập thành công
      const demoUser = {
        id: '123456',
        email: credentials.email || 'demo@example.com',
        fullName: 'Nguyễn Văn Demo',
        phone: '0912345678',
        role: 'user'
      };
      const demoToken = 'demo-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Lưu thông tin đăng nhập
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', demoToken);
      
      // Update state
      setUser(demoUser);
      setIsAuthenticated(true);
      
      // Make auth status globally available for non-React code
      window.getAuthStatus = () => true;
      window.getUser = () => demoUser;
      
      return { success: true, user: demoUser };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.response?.data?.message || 'Đăng nhập thất bại' };
    }
  };
  
  // Hàm đăng xuất
  const logout = async () => {
    try {
      // Trong thực tế, có thể gọi API để invalidate token
      // await API.post('/api/auth/logout');
      
      // Xóa thông tin đăng nhập
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      // Update global status
      window.getAuthStatus = () => false;
      window.getUser = () => null;
      
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, message: error.message || 'Đăng xuất thất bại' };
    }
  };
  
  // Hàm đăng ký
  const register = async (userData) => {
    try {
      // Trong thực tế, đây sẽ là API call đến server
      // const response = await API.post('/api/auth/register', userData);
      // const { user, token } = response.data;
      
      // Demo: Giả lập đăng ký thành công
      const demoUser = {
        id: 'new-' + Math.random().toString(36).substring(2),
        email: userData.email,
        fullName: userData.fullName || userData.email.split('@')[0],
        phone: userData.phone || '',
        role: 'user'
      };
      const demoToken = 'demo-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Lưu thông tin đăng nhập
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', demoToken);
      
      // Update state
      setUser(demoUser);
      setIsAuthenticated(true);
      
      // Make auth status globally available for non-React code
      window.getAuthStatus = () => true;
      window.getUser = () => demoUser;
      
      return { success: true, user: demoUser };
    } catch (error) {
      console.error('Register failed:', error);
      return { success: false, message: error.message || 'Đăng ký thất bại' };
    }
  };

  // Hàm cập nhật thông tin user
  const updateUserProfile = (userData) => {
    try {
      // Trong thực tế, đây sẽ là API call đến server
      // const response = await API.put('/api/users/profile', userData);
      // const updatedUser = response.data;
      
      const updatedUser = { ...user, ...userData };
      
      // Cập nhật localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Cập nhật state
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile failed:', error);
      return { success: false, error: error.message || 'Cập nhật thông tin thất bại' };
    }
  };

  // Giá trị được chia sẻ qua context
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;