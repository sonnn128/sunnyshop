import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop';
import ErrorBoundary from 'components/ErrorBoundary';
import NotFound from 'pages/NotFound';
import VNPayCallback from 'pages/payment/vnpay/callback';
import Checkout from 'pages/checkout';
import { Navigate, useLocation } from 'react-router-dom';
import OrderConfirmation from 'pages/order-confirmation';
import UserOrderDetail from 'pages/order-detail';
import Login from 'pages/auth/Login';
import Register from 'pages/auth/Register';
import ForgotPassword from 'pages/auth/ForgotPassword';
import ResetPassword from 'pages/auth/ResetPassword';
import UserOrders from 'pages/user-orders';
import ShoppingCart from './pages/shopping-cart';
import AdminPanel from './pages/admin-panel';
import AdminLayout from './pages/admin-panel/AdminLayout';
import ProductsList from './pages/admin-panel/products/ProductsList';
import ProductForm from './pages/admin-panel/products/ProductForm';
import CategoryList from './pages/admin-panel/categories/CategoryList';
import CategoryForm from './pages/admin-panel/categories/CategoryForm';
import BrandList from './pages/admin-panel/brands/BrandList';
import BrandForm from './pages/admin-panel/brands/BrandForm';
import ProductDetail from './pages/product-detail';
import ProductCatalog from './pages/product-catalog';
import UserDashboard from './pages/user-dashboard';
import Homepage from './pages/homepage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Forbidden from './pages/Forbidden';
import DebugAuth from './pages/DebugAuth';
import OrdersList from './pages/admin-panel/orders/OrdersList';
import OrderDetail from './pages/admin-panel/orders/OrderDetail';
import OrdersDashboard from './pages/admin-panel/orders/OrdersDashboard';
import UsersList from './pages/admin-panel/users/UsersList';
import UserForm from './pages/admin-panel/users/UserForm';

const Routes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path='/' element={<Homepage />} />
        <Route path='/shopping-cart' element={<ShoppingCart />} />

  {/* Checkout entry point: redirect to dashboard checkout tab when authenticated */}
  <Route path='/checkout' element={<ProtectedRoute><Navigate to="/user-dashboard?tab=checkout" replace /></ProtectedRoute>} />
        <Route path='/order-confirmation/:orderId' element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path='/order-detail/:orderId' element={<ProtectedRoute><UserOrderDetail /></ProtectedRoute>} />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
  <Route path='/forgot-password' element={<ForgotPassword />} />
  <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/user-orders' element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
        
  {/* Payment routes */}
  <Route path='/payment/vnpay/callback' element={<React.Suspense fallback={<div>Loading...</div>}>
    <VNPayCallback />
  </React.Suspense>} />

  {/* Admin routes - Only accessible by staff, manager, and admin roles */}
  <Route path='/admin-panel' element={<AdminRoute><AdminPanel /></AdminRoute>} />
  {/* Product and Category forms wrapped in AdminLayout */}
  <Route path='/admin-panel/products/new' element={<AdminRoute><AdminLayout activeTab="products"><ProductForm /></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/products/:id' element={<AdminRoute><AdminLayout activeTab="products"><ProductForm /></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/categories/new' element={<AdminRoute><AdminLayout activeTab="categories"><CategoryForm /></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/categories/:id' element={<AdminRoute><AdminLayout activeTab="categories"><CategoryForm /></AdminLayout></AdminRoute>} />
  
  {/* Admin Brands Management */}
  <Route path='/admin-panel/brands/new' element={<AdminRoute><AdminLayout activeTab="brands"><BrandForm /></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/brands/:id' element={<AdminRoute><AdminLayout activeTab="brands"><BrandForm /></AdminLayout></AdminRoute>} />
  
  {/* Admin Orders Management */}
  <Route path='/admin-panel/orders' element={<AdminRoute><AdminLayout activeTab="orders"><React.Suspense fallback={<div>Loading...</div>}><OrdersList /></React.Suspense></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/orders/dashboard' element={<AdminRoute><AdminLayout activeTab="orders"><React.Suspense fallback={<div>Loading...</div>}><OrdersDashboard /></React.Suspense></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/orders/:orderId' element={<AdminRoute><AdminLayout activeTab="orders"><React.Suspense fallback={<div>Loading...</div>}><OrderDetail /></React.Suspense></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/users' element={<AdminRoute><AdminLayout activeTab="users"><React.Suspense fallback={<div>Loading...</div>}><UsersList /></React.Suspense></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/users/new' element={<AdminRoute><AdminLayout activeTab="users"><React.Suspense fallback={<div>Loading...</div>}><UserForm /></React.Suspense></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/users/:userId' element={<AdminRoute><AdminLayout activeTab="users"><React.Suspense fallback={<div>Loading...</div>}><UserForm /></React.Suspense></AdminLayout></AdminRoute>} />
  
  {/* 403 Forbidden page */}
  <Route path='/forbidden' element={<Forbidden />} />
  
  {/* Debug Auth page - Development only */}
  <Route path='/debug-auth' element={<DebugAuth />} />
  
        <Route path='/product-detail' element={<ProductDetail />} />
        <Route path='/product-catalog' element={<ProductCatalog />} />
  <Route path='/user-dashboard/*' element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path='/homepage' element={<Homepage />} />
        <Route path='*' element={<NotFound />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
};

export default Routes;
