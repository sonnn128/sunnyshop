import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * AdminRoute component - Only allows staff, manager, and admin roles
 * Blocks customer accounts from accessing admin panel
 */
const AdminRoute = ({ children }) => {
  try {
    const user = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || 'null');
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    
    // Debug: Log authentication check
    console.log('🛡️ AdminRoute Check:', {
      hasUser: !!user,
      hasToken: !!token,
      user,
      userRole: user?.role
    });
    
    // Check authentication first
    if (!user || !token) {
      console.log('❌ AdminRoute: No user/token, redirecting to login');
      return <Navigate to="/login" replace />;
    }

    // Check if user has admin role (staff, manager, or admin)
    const userRole = user.role || 'customer'; // Default to 'customer' if no role
    const allowedRoles = ['staff', 'manager', 'admin'];
    
    if (!allowedRoles.includes(userRole)) {
      // Customer or unauthorized role - redirect to home
      console.log('❌ AdminRoute: Unauthorized role, redirecting to home');
      return <Navigate to="/" replace />;
    }

    console.log('✅ AdminRoute: Access granted');
    // User is authenticated and has admin role
    return children;
  } catch (e) {
    console.error('❌ AdminRoute Error:', e);
    // Error parsing user data - redirect to login
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
