import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModernAdminLayout from './ModernAdminLayout';

/**
 * AdminLayout - Modern version
 * Wraps children with the sidebar-based modern navigation system
 */
const AdminLayout = ({ children, activeTab = 'dashboard' }) => {
  const navigate = useNavigate();

  const handleTabChange = (tabId) => {
    navigate(`/admin?tab=${tabId}`);
  };

  return (
    <ModernAdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {children}
    </ModernAdminLayout>
  );
};

export default AdminLayout;
