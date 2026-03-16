import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useRole } from '../../hooks/useRole';

const AdminLayout = ({ children, activeTab = 'dashboard' }) => {
  const { user, role } = useRole();
  const navigate = useNavigate();

  // Get user display name
  const currentUser = useMemo(() => ({
    name: user?.fullName || user?.username || user?.email || "Admin User",
    role: role,
    avatar: user?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"
  }), [user, role]);

  // Define role labels in Vietnamese
  const roleLabels = {
    staff: 'Nhân viên',
    manager: 'Quản lý',
    admin: 'Quản trị viên'
  };

  // Define all tabs with role requirements
  const allTabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'BarChart3', roles: ['staff', 'manager', 'admin'] },
    { id: 'orders', label: 'Đơn hàng', icon: 'Package', roles: ['staff', 'manager', 'admin'] },
    { id: 'products', label: 'Sản phẩm', icon: 'ShoppingBag', roles: ['staff', 'manager', 'admin'] },
    { id: 'categories', label: 'Danh mục', icon: 'Folder', roles: ['staff', 'manager', 'admin'] },
    { id: 'analytics', label: 'Phân tích', icon: 'TrendingUp', roles: ['manager', 'admin'] },
    { id: 'users', label: 'Người dùng', icon: 'Users', roles: ['admin'] },
    { id: 'settings', label: 'Cài đặt', icon: 'Settings', roles: ['admin'] }
  ];

  // Filter tabs based on user role
  const tabs = useMemo(() => {
    return allTabs.filter(tab => tab.roles.includes(role));
  }, [role]);

  const handleTabChange = (tabId) => {
    navigate(`/admin-panel?tab=${tabId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Quản trị Hệ thống
                </h1>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <span>Chào mừng trở lại,</span>
                  <span className="font-semibold text-foreground">{currentUser.name}</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {roleLabels[currentUser.role]}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  iconName="User" 
                  iconPosition="left"
                  onClick={() => navigate('/user-dashboard')}
                >
                  Dashboard Cá nhân
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                      activeTab === tab?.id
                        ? 'border-accent text-accent' 
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[600px]">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ABC</span>
              </div>
              <span className="text-sm text-muted-foreground">
                © 2024 ABC Fashion Store. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
