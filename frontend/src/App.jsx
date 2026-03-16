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
import Homepage from './pages/homepage';
import ProductCatalog from './pages/product-catalog';
import ProductDetail from './pages/product-detail';
import ShoppingCart from './pages/shopping-cart';
import OrderConfirmation from './pages/order-confirmation';
import UserOrderDetail from './pages/order-detail';
import UserOrders from './pages/user-orders';
import UserDashboard from './pages/user-dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminPanel from './pages/admin-panel';
import AdminLayout from './pages/admin-panel/AdminLayout';
import ProductsList from './pages/admin-panel/products/ProductsList';
import ProductForm from './pages/admin-panel/products/ProductForm';
import CategoryList from './pages/admin-panel/categories/CategoryList';
import CategoryForm from './pages/admin-panel/categories/CategoryForm';
import BrandList from './pages/admin-panel/brands/BrandList';
import BrandForm from './pages/admin-panel/brands/BrandForm';
import OrdersList from './pages/admin-panel/orders/OrdersList';
import OrderDetail from './pages/admin-panel/orders/OrderDetail';
import OrdersDashboard from './pages/admin-panel/orders/OrdersDashboard';
import UsersList from './pages/admin-panel/users/UsersList';
import UserForm from './pages/admin-panel/users/UserForm';
import VNPayCallback from './pages/payment/vnpay/callback';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import DebugAuth from './pages/DebugAuth';
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
                  isAuthenticated ? (
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
                  ) : (
                    <Navigate to="/court-login" replace />
                  )
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
              <Route path="/admin-panel" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/admin-panel/products/new" element={<AdminRoute><AdminLayout activeTab="products"><ProductForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/products/:id" element={<AdminRoute><AdminLayout activeTab="products"><ProductForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/categories/new" element={<AdminRoute><AdminLayout activeTab="categories"><CategoryForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/categories/:id" element={<AdminRoute><AdminLayout activeTab="categories"><CategoryForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/brands/new" element={<AdminRoute><AdminLayout activeTab="brands"><BrandForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/brands/:id" element={<AdminRoute><AdminLayout activeTab="brands"><BrandForm /></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/orders" element={<AdminRoute><AdminLayout activeTab="orders"><React.Suspense fallback={<div>Loading...</div>}><OrdersList /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/orders/dashboard" element={<AdminRoute><AdminLayout activeTab="orders"><React.Suspense fallback={<div>Loading...</div>}><OrdersDashboard /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/orders/:orderId" element={<AdminRoute><AdminLayout activeTab="orders"><React.Suspense fallback={<div>Loading...</div>}><OrderDetail /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/users" element={<AdminRoute><AdminLayout activeTab="users"><React.Suspense fallback={<div>Loading...</div>}><UsersList /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/users/new" element={<AdminRoute><AdminLayout activeTab="users"><React.Suspense fallback={<div>Loading...</div>}><UserForm /></React.Suspense></AdminLayout></AdminRoute>} />
              <Route path="/admin-panel/users/:userId" element={<AdminRoute><AdminLayout activeTab="users"><React.Suspense fallback={<div>Loading...</div>}><UserForm /></React.Suspense></AdminLayout></AdminRoute>} />

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