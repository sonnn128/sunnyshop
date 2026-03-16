import React, { useState, useMemo } from 'react';
import { useRole } from '../../hooks/useRole';
import ModernSidebar from './components/ModernSidebar';
import ModernHeader from './components/ModernHeader';

const ModernAdminLayout = ({ children, activeTab, onTabChange }) => {
  const { user, role } = useRole();
  const [collapsed, setCollapsed] = useState(false);

  const currentUser = useMemo(() => ({
    name: user?.fullName || user?.username || user?.email || "Admin User",
    role: role,
    avatar: user?.avatar
  }), [user, role]);

  const roleLabels = {
    staff: 'Nhân viên',
    manager: 'Quản lý',
    admin: 'Quản trị viên'
  };

  const tabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'LayoutDashboard', roles: ['staff', 'manager', 'admin'] },
    { id: 'orders', label: 'Đơn hàng', icon: 'ShoppingBag', roles: ['staff', 'manager', 'admin'] },
    { id: 'products', label: 'Sản phẩm', icon: 'Package', roles: ['staff', 'manager', 'admin'] },
    { id: 'categories', label: 'Danh mục', icon: 'FolderTree', roles: ['staff', 'manager', 'admin'] },
    { id: 'brands', label: 'Thương hiệu', icon: 'Globe', roles: ['staff', 'manager', 'admin'] },
    { id: 'chat', label: 'Tin nhắn', icon: 'MessageCircle', roles: ['staff', 'manager', 'admin'] },
    { id: 'analytics', label: 'Phân tích', icon: 'BarChart3', roles: ['manager', 'admin'] },
    { id: 'users', label: 'Người dùng', icon: 'Users', roles: ['admin'] },
    { id: 'settings', label: 'Cài đặt', icon: 'Settings', roles: ['admin'] }
  ].filter(tab => tab.roles.includes(role));

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <ModernSidebar 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      
      <ModernHeader 
        collapsed={collapsed} 
        user={currentUser} 
        roleLabels={roleLabels}
      />

      <main 
        className={`transition-all duration-300 min-h-screen pt-28 pb-12 px-8 ${
          collapsed ? "pl-28" : "pl-72"
        }`}
      >
        <div className="max-w-[1600px] mx-auto animate-fade-in">
          {children}
        </div>
      </main>

      {/* Background blobs for premium feel */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
};

export default ModernAdminLayout;
