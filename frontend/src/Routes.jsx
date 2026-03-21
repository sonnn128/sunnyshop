import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/shared/errors/NotFound";
import VNPayCallback from "pages/client/payment/vnpay/callback";
import Checkout from "pages/client/checkout";
import { Navigate, useLocation } from "react-router-dom";
import OrderConfirmation from "pages/client/order-confirmation";
import UserOrderDetail from "pages/client/order-detail";
import Login from "pages/shared/auth/Login";
import Register from "pages/shared/auth/Register";
import ForgotPassword from "pages/shared/auth/ForgotPassword";
import ResetPassword from "pages/shared/auth/ResetPassword";
import UserOrders from "pages/client/user-orders";
import ShoppingCart from "./pages/client/shopping-cart";
import AdminPanel from "./pages/admin";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductForm from "./pages/admin/products/ProductForm";
import ProductDetailAdmin from "./pages/admin/products/ProductDetail";
import CategoryForm from "./pages/admin/categories/CategoryForm";
import CategoryDetailAdmin from "./pages/admin/categories/CategoryDetail";
import BrandForm from "./pages/admin/brands/BrandForm";
import ProductDetail from "./pages/shared/product-detail";
import ProductCatalog from "./pages/shared/product-catalog";
import UserDashboard from "./pages/client/user-dashboard";
import Homepage from "./pages/shared/homepage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Forbidden from "./pages/shared/errors/Forbidden";
import DebugAuth from "./pages/shared/DebugAuth";
import OrdersList from "./pages/admin/orders/OrdersList";
import OrderDetail from "./pages/admin/orders/OrderDetail";
import OrdersDashboard from "./pages/admin/orders/OrdersDashboard";
import UsersList from "./pages/admin/users/UsersList";
import UserForm from "./pages/admin/users/UserForm";
import AddressList from "./pages/admin/addresses/AddressList";
import AddressForm from "./pages/admin/addresses/AddressForm";

const Routes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/" element={<Homepage />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />

        {/* Checkout entry point: redirect to dashboard checkout tab when authenticated */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Navigate to="/user-dashboard?tab=checkout" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:orderId"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-detail/:orderId"
          element={
            <ProtectedRoute>
              <UserOrderDetail />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/user-orders"
          element={
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          }
        />

        {/* Payment routes */}
        <Route
          path="/payment/vnpay/callback"
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <VNPayCallback />
            </React.Suspense>
          }
        />

        {/* MORE SPECIFIC admin routes must come FIRST - before generic /admin */}
        {/* Notice: Admin panel now imports from pages/admin */}
        <Route
          path="/admin/products/new"
          element={
            <AdminRoute>
              <AdminLayout activeTab="products">
                <ProductForm />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/:id/detail"
          element={
            <AdminRoute>
              <AdminLayout activeTab="products">
                <ProductDetailAdmin />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/:id"
          element={
            <AdminRoute>
              <AdminLayout activeTab="products">
                <ProductForm />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories/new"
          element={
            <AdminRoute>
              <AdminLayout activeTab="categories">
                <CategoryForm />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories/:id/detail"
          element={
            <AdminRoute>
              <AdminLayout activeTab="categories">
                <CategoryDetailAdmin />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories/:id"
          element={
            <AdminRoute>
              <AdminLayout activeTab="categories">
                <CategoryForm />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* Admin Brands Management */}
        <Route
          path="/admin/brands/new"
          element={
            <AdminRoute>
              <AdminLayout activeTab="brands">
                <BrandForm />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/brands/:id"
          element={
            <AdminRoute>
              <AdminLayout activeTab="brands">
                <BrandForm />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* Admin Orders Management */}
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminLayout activeTab="orders">
                <React.Suspense fallback={<div>Loading...</div>}>
                  <OrdersList />
                </React.Suspense>
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders/dashboard"
          element={
            <AdminRoute>
              <AdminLayout activeTab="orders">
                <React.Suspense fallback={<div>Loading...</div>}>
                  <OrdersDashboard />
                </React.Suspense>
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders/:orderId"
          element={
            <AdminRoute>
              <AdminLayout activeTab="orders">
                <React.Suspense fallback={<div>Loading...</div>}>
                  <OrderDetail />
                </React.Suspense>
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout activeTab="users">
                <React.Suspense fallback={<div>Loading...</div>}>
                  <UsersList />
                </React.Suspense>
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <AdminRoute>
              <AdminLayout activeTab="users">
                <React.Suspense fallback={<div>Loading...</div>}>
                  <UserForm />
                </React.Suspense>
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <AdminRoute>
              <AdminLayout activeTab="users">
                <React.Suspense fallback={<div>Loading...</div>}>
                  <UserForm />
                </React.Suspense>
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* Admin Addresses Management */}
        <Route
          path="/admin/addresses/new"
          element={
            <AdminRoute>
              <AdminLayout activeTab="addresses">
                <AddressForm />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/addresses/:id"
          element={
            <AdminRoute>
              <AdminLayout activeTab="addresses">
                <AddressForm />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/addresses"
          element={
            <AdminRoute>
              <AdminLayout activeTab="addresses">
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AddressList />
                </React.Suspense>
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* GENERIC /admin dashboard route - must come AFTER all specific /admin/* routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        {/* 403 Forbidden page */}
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Debug Auth page - Development only */}
        <Route path="/debug-auth" element={<DebugAuth />} />

        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/product-catalog" element={<ProductCatalog />} />
        <Route
          path="/user-dashboard/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
};

export default Routes;
