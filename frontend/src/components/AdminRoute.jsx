import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AdminRoute component - Only allows staff, manager, and admin roles
 * Blocks customer accounts from accessing admin panel
 */
const AdminRoute = ({ children }) => {
  const location = useLocation();
  
  try {
    const user = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || 'null');
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    
    // Check authentication
    if (!user || !token) {
      // Store the location they were trying to access to redirect back after login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has an admin-level role
    // Allowed roles for admin panel: 'admin', 'manager', 'staff'
    const allowedRoles = ['admin', 'manager', 'staff'];
    const userRole = user.role || 'customer'; // Default to 'customer' if role not set
    
    if (!allowedRoles.includes(userRole)) {
      // Redirect to forbidden page if user is not authorized
      return <Navigate to="/forbidden" replace />;
    }

    return children;
  } catch (e) {
    console.error("AdminRoute error:", e);
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
