import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component for authentication and role-based access control
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} props.requiredRole - Required role(s) to access the route
 *   - Can be a single role string: 'admin', 'manager', 'staff'
 *   - Or array of allowed roles: ['manager', 'admin']
 *   - If not provided, only authentication is checked
 * @param {string} props.redirectTo - Custom redirect path for unauthorized access (default: '/login' for auth, '/' for role)
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo }) => {
  try {
    const user = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || 'null');
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    
    // Check authentication
    if (!user || !token) {
      return <Navigate to={redirectTo || "/login"} replace />;
    }

    // Check role-based access if requiredRole is specified
    if (requiredRole) {
      const userRole = user.role || 'staff'; // Default to 'staff' if role not set
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      if (!allowedRoles.includes(userRole)) {
        // Redirect to home or 403 page if user doesn't have required role
        return <Navigate to={redirectTo || "/"} replace />;
      }
    }

    return children;
  } catch (e) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }
};

export default ProtectedRoute;
