import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import Navbar from '@/components/layout/Navbar.jsx';
import CategoryStrip from '@/components/CategoryStrip.jsx';
import AdminLayout from '@/components/layout/AdminLayout.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ClientRoute from '@/components/ClientRoute.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { CartProvider } from '@/contexts/CartContext.jsx';
import { WishlistProvider } from '@/contexts/WishlistContext.jsx';

// Pages
import HomePage from '@/pages/client/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';
import ProductPage from '@/pages/client/ProductPage.jsx';
import ProductDetailPage from '@/pages/client/ProductDetailPage.jsx';
import CartPage from '@/pages/client/CartPage.jsx';
import CheckoutPage from '@/pages/client/CheckoutPage.jsx';
import OrderPage from '@/pages/client/OrderPage.jsx';
import OrderHistoryPage from '@/pages/client/OrderHistoryPage.jsx';
import ProfilePage from '@/pages/client/ProfilePage.jsx';
import AddressBookPage from '@/pages/client/AddressBookPage.jsx';
import WishlistPage from '@/pages/client/WishlistPage.jsx';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '@/pages/ResetPasswordPage.jsx';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard.jsx';
import Products from '@/pages/admin/Products.jsx';
import Users from '@/pages/admin/Users.jsx';
import Orders from '@/pages/admin/Orders.jsx';
import Categories from '@/pages/admin/Categories.jsx';
import Settings from '@/pages/admin/Settings.jsx';
import PermissionManagement from '@/pages/admin/PermissionManagement.jsx';

const { Content, Footer } = Layout;
import { theme } from 'antd';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CategoryStrip />}
      <Content style={{ padding: isAdminRoute ? 0 : '0 50px', marginTop: isAdminRoute ? 0 : 64 }}>
        <div style={{ padding: isAdminRoute ? 0 : 24, minHeight: 380 }}>
          <Routes>
            {/* Public Routes */}
            {/* Public Routes - Client Only */}
            <Route path="/" element={
              <ClientRoute>
                <HomePage />
              </ClientRoute>
            } />
            <Route path="/products" element={
              <ClientRoute>
                <ProductPage />
              </ClientRoute>
            } />
            <Route path="/products/:id" element={
              <ClientRoute>
                <ProductDetailPage />
              </ClientRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Routes - Client Only (Admins blocked) */}
            <Route path="/cart" element={
              <ClientRoute>
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              </ClientRoute>
            } />
            <Route path="/checkout" element={
              <ClientRoute>
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              </ClientRoute>
            } />
            <Route path="/profile" element={
              <ClientRoute>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </ClientRoute>
            } />
            <Route path="/profile/addresses" element={
              <ClientRoute>
                <ProtectedRoute>
                  <AddressBookPage />
                </ProtectedRoute>
              </ClientRoute>
            } />
            <Route path="/wishlist" element={
              <ClientRoute>
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              </ClientRoute>
            } />
            <Route path="/orders" element={
              <ClientRoute>
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              </ClientRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <Products />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <Categories />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/permissions" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <PermissionManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Content>
      {!isAdminRoute && (
        <Footer style={{ textAlign: 'center' }}>
          Sunny Shop ©{new Date().getFullYear()} Created by Son Nguyen
        </Footer>
      )}
    </Layout>
  );
};

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext.jsx';

const AppContentInner = () => {
  const { isDarkMode } = useTheme();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  const appTheme = {
    algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  };

  return (
    <ConfigProvider theme={appTheme}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <AppContent />
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContentInner />
    </ThemeProvider>
  );
}

export default App;
