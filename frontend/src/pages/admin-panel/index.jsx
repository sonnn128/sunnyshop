import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import API from '../../lib/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Modern Components
import ModernAdminLayout from './ModernAdminLayout';
import ModernStatsCard from './components/ModernStatsCard';
import ModernQuickActions from './components/ModernQuickActions';
import ModernRecentOrders from './components/ModernRecentOrders';
import ModernActivityFeed from './components/ModernActivityFeed';
import ModernSalesChart from './components/ModernSalesChart';

// Other List Components (Existing)
import OrdersList from './orders/OrdersList';
import ProductsList from './products/ProductsList';
import CategoryList from './categories/CategoryList';
import BrandList from './brands/BrandList';
import UsersList from './users/UsersList';
import ChatManagement from './chat/ChatManagement';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TopProduct from './components/TopProduct';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const { user, role, permissions } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/admin-panel?tab=${tabId}`, { replace: true });
  };

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
      setStatsError(error?.response?.data?.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  const formatCurrency = (value = 0) => `${Number(value).toLocaleString('vi-VN')} VND`;
  const formatNumber = (value = 0) => Number(value).toLocaleString('vi-VN');
  const formatPercent = (value = 0) => {
    const v = Number(value);
    return `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;
  };

  const statsData = useMemo(() => {
    const stats = dashboardData?.stats;
    if (!stats) return [];
    return [
      { title: 'Doanh thu tháng', value: formatCurrency(stats.revenue.current), change: formatPercent(stats.revenue.changePercent), changeType: stats.revenue.changeType, icon: 'DollarSign', color: 'primary' },
      { title: 'Đơn hàng mới', value: formatNumber(stats.orders.current), change: formatPercent(stats.orders.changePercent), changeType: stats.orders.changeType, icon: 'ShoppingCart', color: 'success' },
      { title: 'Khách hàng mới', value: formatNumber(stats.customers.current), change: formatPercent(stats.customers.changePercent), changeType: stats.customers.changeType, icon: 'Users', color: 'accent' },
      { title: 'Sản phẩm tồn', value: formatNumber(stats.inventory.total), change: stats.inventory.lowStock > 0 ? `${stats.inventory.lowStock} sắp hết` : 'Ổn định', changeType: stats.inventory.lowStock > 0 ? 'decrease' : 'neutral', icon: 'Package', color: 'warning' }
    ];
  }, [dashboardData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Header section with page title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-foreground">Tổng quan hệ thống</h2>
                <p className="text-muted-foreground mt-1 font-medium">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm" iconName="Download">Xuất dữ liệu</Button>
                <Button className="rounded-2xl shadow-lg shadow-primary/20" iconName="Plus" onClick={() => navigate('/admin-panel/products/new')}>Thêm sản phẩm</Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading ? [...Array(4)].map((_, i) => <div key={i} className="h-32 bg-card/40 animate-pulse rounded-3xl" />) :
               statsData.map((stat, i) => <ModernStatsCard key={i} {...stat} />)}
            </div>

            {/* Main Charts & Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ModernSalesChart data={dashboardData?.revenueTrend || []} loading={statsLoading} onRetry={loadDashboardStats} />
                <ModernRecentOrders />
              </div>
              <div className="space-y-8">
                <ModernQuickActions />
                <ModernActivityFeed className="flex-1 min-h-[500px]" />
              </div>
            </div>
          </div>
        );
      case 'orders': return <OrdersList />;
      case 'products': return <ProductsList />;
      case 'categories': return <CategoryList />;
      case 'brands': return <BrandList />;
      case 'chat': return <ChatManagement />;
      case 'users': return <UsersList />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'settings': return (
        <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Icon name="Settings" size={40} className="text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Cài đặt hệ thống</h3>
          <p className="text-muted-foreground max-w-md mx-auto">Tính năng này đang được phát triển. Vui lòng quay lại sau.</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <ModernAdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </ModernAdminLayout>
  );
};

export default AdminPanel;