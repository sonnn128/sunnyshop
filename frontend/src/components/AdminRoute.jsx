import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * AdminRoute component - Only allows staff, manager, and admin roles
 * Blocks customer accounts from accessing admin panel
 */
const AdminRoute = ({ children }) => {
  // Tạm thời tắt xác thực để dev dễ dàng hơn theo yêu cầu của user
  return children;
};

export default AdminRoute;
