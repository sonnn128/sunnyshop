import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import API from '../../lib/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

// Modern Components
import ModernAdminLayout from './ModernAdminLayout';
import ModernStatsCard from './components/ModernStatsCard';
import ModernQuickActions from './components/ModernQuickActions';
import ModernRecentOrders from './components/ModernRecentOrders';
import ModernActivityFeed from './components/ModernActivityFeed';

// Other List Components (Existing)
import OrdersList from './orders/OrdersList';
import ProductsList from './products/ProductsList';
import CategoryList from './categories/CategoryList';
import BrandList from './brands/BrandList';
import UsersList from './users/UsersList';
import ChatManagement from './chat/ChatManagement';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TopProducts from './components/TopProduct';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const { role } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

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
      setStatsLoading(true);
      const response = await API.get('/dashboard/stats');
      if (response?.data?.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  const formatPercent = (value = 0) => {
    const v = Number(value);
    return `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;
  };

  const statsData = useMemo(() => {
    const stats = dashboardData?.stats;
    if (!stats) return [];
    return [
      { title: 'Doanh thu tháng', value: formatCurrency(stats.revenue.current), change: formatPercent(stats.revenue.changePercent), changeType: stats.revenue.changeType, icon: 'DollarSign', color: 'primary' },
      { title: 'Tổng đơn hàng', value: formatNumber(stats.orders.current), change: formatPercent(stats.orders.changePercent), changeType: stats.orders.changeType, icon: 'ShoppingCart', color: 'success' },
      { title: 'Khách hàng mới', value: formatNumber(stats.customers.current), change: formatPercent(stats.customers.changePercent), changeType: stats.customers.changeType, icon: 'Users', color: 'accent' },
      { title: 'Kho hàng', value: formatNumber(stats.inventory.total), change: stats.inventory.lowStock > 0 ? `${stats.inventory.lowStock} sắp hết` : 'Ổn định', changeType: stats.inventory.lowStock > 0 ? 'decrease' : 'neutral', icon: 'Package', color: 'warning' }
    ];
  }, [dashboardData, formatCurrency, formatNumber]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12">
            {/* Elite Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-serif text-slate-900 leading-[1.1]"
                >
                  Tổng quan <br /> <span className="italic text-slate-500">điều hành</span>
                </motion.h2>
                <div className="flex items-center gap-3 mt-6">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    Đã đồng bộ: {new Date().toLocaleTimeString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="h-14 px-8 rounded-none border-slate-200 bg-white text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-slate-50 transition-all duration-300" 
                  iconName="Download"
                >
                  Xuất báo cáo
                </Button>
                <Button 
                  className="h-14 px-8 rounded-none bg-slate-900 text-white shadow-xl shadow-slate-900/10 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all duration-300" 
                  iconName="Plus" 
                  onClick={() => navigate('/admin-panel/products/new')}
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading ? [...Array(4)].map((_, i) => <div key={i} className="h-44 bg-slate-100 animate-pulse rounded-none" />) :
               statsData.map((stat, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                 >
                   <ModernStatsCard {...stat} />
                 </motion.div>
               ))}
            </div>

            {/* Interactive Intelligence Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Main Visualization Center */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="xl:col-span-8 space-y-8"
              >
                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
                  <div className="bg-white rounded-none border border-slate-200 shadow-sm">
                    <ModernRecentOrders />
                  </div>
                  <div className="bg-white rounded-none border border-slate-200 shadow-sm">
                    <TopProducts />
                  </div>
                </div>
              </motion.div>

              {/* Side Intelligence Center */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="xl:col-span-4 space-y-8"
              >
                <div className="bg-white rounded-none border border-slate-200 shadow-sm">
                  <ModernQuickActions />
                </div>
                <div className="bg-white rounded-none p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">Hoạt động gần đây</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Thời gian thực</span>
                    </div>
                  </div>
                  <ModernActivityFeed />
                </div>
              </motion.div>
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
        <div className="glass-card rounded-[3rem] p-32 text-center border-border/30">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-primary/20"
          >
            <Icon name="Settings" size={48} className="text-primary" />
          </motion.div>
          <h3 className="text-4xl font-black text-foreground mb-4">Core Settings</h3>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">Intelligence parameters are currently locked for core initialization. Please contact system admin.</p>
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