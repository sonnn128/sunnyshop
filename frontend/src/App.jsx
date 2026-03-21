import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/auth.store';
import AuthProvider from './contexts/AuthContext';
import { ToastProvider } from './components/ui/ToastProvider';
import { WishlistProvider } from './contexts/WishlistContext';
import ChatWidget from './components/ChatWidget';

// ===== Admin / Court Management Pages (Frontend) =====
import LoginPage from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import BookingCalendarPage from '@/pages/BookingCalendarPage';
import CustomersPage from '@/pages/CustomersPage';
import CustomerDetailPage from '@/pages/CustomerDetailPage';
import CourtsPage from '@/pages/CourtsPage';
import InvoicesPage from '@/pages/InvoicesPage';
import PrintInvoicePage from '@/pages/PrintInvoicePage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import InventoryPage from '@/pages/InventoryPage';
import VenuesPage from '@/pages/VenuesPage';
import { AppLayout } from '@/components/layout/AppLayout';

// ===== E-Commerce Pages (Frontend-Template) =====
import Homepage from './pages/shared/homepage';
import ProductCatalog from './pages/shared/product-catalog';
import ProductDetail from './pages/shared/product-detail';
import ShoppingCart from './pages/client/shopping-cart';
import OrderConfirmation from './pages/client/order-confirmation';
import UserOrderDetail from './pages/client/order-detail';
import UserOrders from './pages/client/user-orders';
import UserDashboard from './pages/client/user-dashboard';
import Login from './pages/shared/auth/Login';
import Register from './pages/shared/auth/Register';
import ForgotPassword from './pages/shared/auth/ForgotPassword';
import ResetPassword from './pages/shared/auth/ResetPassword';
import AdminPanel from './pages/admin';
import AdminLayout from './pages/admin/AdminLayout';
import ProductForm from './pages/admin/products/ProductForm';
import CategoryList from './pages/admin/categories/CategoryList';
import CategoryForm from './pages/admin/categories/CategoryForm';
import CategoryDetail from './pages/admin/categories/CategoryDetail';
import BrandList from './pages/admin/brands/BrandList';
import BrandForm from './pages/admin/brands/BrandForm';
import OrdersList from './pages/admin/orders/OrdersList';
import OrderDetail from './pages/admin/orders/OrderDetail';
import OrdersDashboard from './pages/admin/orders/OrdersDashboard';
import UsersList from './pages/admin/users/UsersList';
import UserForm from './pages/admin/users/UserForm';
import VNPayCallback from './pages/client/payment/vnpay/callback';
import NotFound from './pages/shared/errors/NotFound';
import Forbidden from './pages/shared/errors/Forbidden';
import DebugAuth from './pages/shared/DebugAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <Toaster />
            <ChatWidget />
            <Routes>
              {/* ===== Court Management Routes ===== */}
              <Route
                path="/court-login"
                element={isAuthenticated ? <Navigate to="/court" replace /> : <LoginPage />}
              />
              <Route
                path="/court-forgot-password"
                element={isAuthenticated ? <Navigate to="/court" replace /> : <ForgotPasswordPage />}
              />
              <Route
                path="/invoices/:id/print"
                element={isAuthenticated ? <PrintInvoicePage /> : <Navigate to="/court-login" replace />}
              />
              <Route
                path="/court/*"
                element={
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/calendar" element={<BookingCalendarPage />} />
                      <Route path="/customers" element={<CustomersPage />} />
                      <Route path="/customers/:id" element={<CustomerDetailPage />} />
                      <Route path="/courts" element={<CourtsPage />} />
                      <Route path="/invoices" element={<InvoicesPage />} />
                      <Route path="/inventory" element={<InventoryPage />} />
                      <Route path="/venues" element={<VenuesPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="*" element={<Navigate to="/court/" replace />} />
                    </Routes>
                  </AppLayout>
                }
              />

              {/* ===== E-Commerce Routes ===== */}
              <Route path="/" element={<Homepage />} />
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/product-catalog" element={<ProductCatalog />} />
              <Route path="/product-detail" element={<ProductDetail />} />
              <Route path="/shopping-cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<ProtectedRoute><Navigate to="/user-dashboard?tab=checkout" replace /></ProtectedRoute>} />
              <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              <Route path="/order-detail/:orderId" element={<ProtectedRoute><UserOrderDetail /></ProtectedRoute>} />
              <Route path="/user-orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
              <Route path="/user-dashboard/*" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Payment */}
              <Route path="/payment/vnpay/callback" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <VNPayCallback />
                </React.Suspense>
              } />

              {/* Admin Panel */}
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/admin/products/new" element={<AdminRoute><AdminLayout activeTab="products"><ProductForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin/products/:id" element={<AdminRoute><AdminLayout activeTab="products"><ProductForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin/categories/new" element={<AdminRoute><AdminLayout activeTab="categories"><CategoryForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin/categories/:id/detail" element={<AdminRoute><AdminLayout activeTab="categories"><CategoryDetail /></AdminLayout></AdminRoute>} />
              <Route path="/admin/categories/:id" element={<AdminRoute><AdminLayout activeTab="categories"><CategoryForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin/brands/new" element={<AdminRoute><AdminLayout activeTab="brands"><BrandForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin/brands/:id" element={<AdminRoute><AdminLayout activeTab="brands"><BrandForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminLayout activeTab="orders"><React.Suspense fallback={<div>Loading...</div>}><OrdersList /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin/orders/dashboard" element={<AdminRoute><AdminLayout activeTab="orders"><React.Suspense fallback={<div>Loading...</div>}><OrdersDashboard /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin/orders/:orderId" element={<AdminRoute><AdminLayout activeTab="orders"><React.Suspense fallback={<div>Loading...</div>}><OrderDetail /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminLayout activeTab="users"><React.Suspense fallback={<div>Loading...</div>}><UsersList /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin/users/new" element={<AdminRoute><AdminLayout activeTab="users"><React.Suspense fallback={<div>Loading...</div>}><UserForm /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin/users/:userId" element={<AdminRoute><AdminLayout activeTab="users"><React.Suspense fallback={<div>Loading...</div>}><UserForm /></React.Suspense></AdminLayout></AdminRoute>} />

              {/* Misc */}
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="/debug-auth" element={<DebugAuth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;