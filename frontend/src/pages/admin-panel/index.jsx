import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StatsCard from './components/StatsCard';
import QuickActions from './components/QuickActions';
import RecentOrders from './components/RecentOrders';
import OrdersList from './orders/OrdersList';
import ActivityFeed from './components/ActivityFeed';
import SalesChart from './components/SalesChart';
import TopProduct from './components/TopProduct';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ProductsList from './products/ProductsList';
import ProductForm from './products/ProductForm';
import CategoryList from './categories/CategoryList';
import CategoryForm from './categories/CategoryForm';
import BrandList from './brands/BrandList';
import BrandForm from './brands/BrandForm';
import UsersList from './users/UsersList';
import ChatManagement from './chat/ChatManagement';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import API from '../../lib/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const { user, role, permissions, isAdmin, isManager } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Sync activeTab with URL query param or state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update URL when activeTab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Update URL with query param
    navigate(`/admin-panel?tab=${tabId}`, { replace: true });
  };

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
    { id: 'brands', label: 'Thương hiệu', icon: 'Briefcase', roles: ['staff', 'manager', 'admin'] },
    { id: 'chat', label: 'Tin nhắn', icon: 'MessageCircle', roles: ['staff', 'manager', 'admin'] },
    { id: 'analytics', label: 'Phân tích', icon: 'TrendingUp', roles: ['manager', 'admin'] },
    { id: 'users', label: 'Người dùng', icon: 'Users', roles: ['admin'] },
    { id: 'settings', label: 'Cài đặt', icon: 'Settings', roles: ['admin'] }
  ];

  // Filter tabs based on user role
  const tabs = useMemo(() => {
    return allTabs.filter(tab => tab.roles.includes(role));
  }, [role]);

  const formatCurrency = useCallback((value = 0) => {
    return `${Number(value || 0).toLocaleString('vi-VN')} VND`;
  }, []);

  const formatNumber = useCallback((value = 0) => {
    return Number(value || 0).toLocaleString('vi-VN');
  }, []);

  const formatPercentChange = useCallback((value = 0) => {
    const percent = Number(value || 0);
    if (!Number.isFinite(percent) || percent === 0) return '0%';
    const absValue = Math.abs(percent).toFixed(1).replace(/\.0$/, '');
    const sign = percent > 0 ? '+' : '-';
    return `${sign}${absValue}%`;
  }, []);

  const loadDashboardStats = useCallback(async () => {
    try {
      setStatsError(null);
      setStatsLoading(true);
      const response = await API.get('/api/dashboard/stats');
      if (response?.data?.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response?.data?.message || 'Không thể tải dữ liệu thống kê');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      const message = error?.response?.data?.message || 'Không thể tải dữ liệu thống kê';
      setStatsError(message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  const statsData = useMemo(() => {
    const stats = dashboardData?.stats;
    if (!stats) return [];

    const inventoryAlert = stats.inventory.lowStock > 0
      ? {
          change: `${stats.inventory.lowStock} sản phẩm sắp hết`,
          changeType: 'decrease'
        }
      : stats.inventory.outOfStock > 0
        ? {
            change: `${stats.inventory.outOfStock} sản phẩm hết hàng`,
            changeType: 'decrease'
          }
        : {
            change: 'Ổn định',
            changeType: 'neutral'
          };

    return [
      {
        title: 'Doanh thu tháng này',
        value: formatCurrency(stats.revenue.current),
        change: formatPercentChange(stats.revenue.changePercent),
        changeType: stats.revenue.changeType,
        icon: 'DollarSign',
        color: 'success'
      },
      {
        title: 'Đơn hàng mới (tháng)',
        value: formatNumber(stats.orders.current),
        change: formatPercentChange(stats.orders.changePercent),
        changeType: stats.orders.changeType,
        icon: 'ShoppingCart',
        color: 'primary'
      },
      {
        title: 'Khách hàng mới (tháng)',
        value: formatNumber(stats.customers.current),
        change: formatPercentChange(stats.customers.changePercent),
        changeType: stats.customers.changeType,
        icon: 'Users',
        color: 'accent'
      },
      {
        title: 'Tồn kho',
        value: formatNumber(stats.inventory.total),
        change: inventoryAlert.change,
        changeType: inventoryAlert.changeType,
        icon: 'Package',
        color: 'warning'
      }
    ];
  }, [dashboardData, formatCurrency, formatNumber, formatPercentChange]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading && (
                [...Array(4)].map((_, index) => (
                  <div
                    key={`stats-skeleton-${index}`}
                    className="bg-card border border-border rounded-lg p-6 shadow-elegant animate-pulse"
                  >
                    <div className="h-4 w-24 bg-muted rounded mb-4" />
                    <div className="h-8 w-32 bg-muted rounded" />
                    <div className="h-4 w-20 bg-muted rounded mt-4" />
                  </div>
                ))
              )}

              {!statsLoading && statsError && (
                <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-card border border-border rounded-lg p-6 shadow-elegant">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Không thể tải thống kê</h3>
                      <p className="text-sm text-muted-foreground mt-1">{statsError}</p>
                    </div>
                    <Button variant="outline" iconName="RefreshCw" onClick={loadDashboardStats}>
                      Thử lại
                    </Button>
                  </div>
                </div>
              )}

              {!statsLoading && !statsError && statsData?.length > 0 && (
                statsData.map((stat, index) => (
                  <StatsCard key={index} {...stat} />
                ))
              )}
            </div>
            {/* Quick Actions & Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SalesChart
                  data={dashboardData?.revenueTrend || []}
                  loading={statsLoading}
                  error={statsError}
                  onRetry={loadDashboardStats}
                />
              </div>
              <div>
                <ActivityFeed />
              </div>
            </div>
            {/* Sales Chart */}
            {/* <SalesChart /> */}
            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RecentOrders />
              </div>
              <div>
                <TopProduct />
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <OrdersList />
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <ProductsList />
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <CategoryList />
          </div>
        );

      case 'brands':
        return (
          <div className="space-y-6">
            <BrandList />
          </div>
        );

      case 'chat':
        return (
          <div className="space-y-6">
            <ChatManagement />
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <UsersList />
          </div>
        );

      case 'analytics':
        return (
          <AnalyticsDashboard />
        );

      case 'settings':
        return (
          <div className="bg-card border border-border rounded-lg p-8 shadow-elegant text-center">
            <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Cài đặt hệ thống</h3>
            <p className="text-muted-foreground">Tính năng cài đặt đang được phát triển</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Bảng điều khiển quản trị</h1>
                <p className="text-muted-foreground mt-1">
                  Chào mừng trở lại, {currentUser?.name} ({roleLabels[role] || role})
                </p>
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
                {permissions.canViewSalesReports && (
                  <Button variant="outline" iconName="Download" iconPosition="left">
                    Xuất báo cáo
                  </Button>
                )}
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

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={20} color="white" />
              </div>
              <div>
                <div className="font-accent font-semibold text-lg text-primary">ABC Fashion</div>
                <div className="text-xs text-muted-foreground">Admin Panel</div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} ABC Fashion Store. Tất cả quyền được bảo lưu.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;