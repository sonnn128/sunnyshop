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
import ModernSalesChart from './components/ModernSalesChart';

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
      const response = await API.get('/api/dashboard/stats');
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
      { title: 'Monthly Revenue', value: formatCurrency(stats.revenue.current), change: formatPercent(stats.revenue.changePercent), changeType: stats.revenue.changeType, icon: 'DollarSign', color: 'primary' },
      { title: 'Total Orders', value: formatNumber(stats.orders.current), change: formatPercent(stats.orders.changePercent), changeType: stats.orders.changeType, icon: 'ShoppingCart', color: 'success' },
      { title: 'New Customers', value: formatNumber(stats.customers.current), change: formatPercent(stats.customers.changePercent), changeType: stats.customers.changeType, icon: 'Users', color: 'accent' },
      { title: 'Store Inventory', value: formatNumber(stats.inventory.total), change: stats.inventory.lowStock > 0 ? `${stats.inventory.lowStock} points low` : 'Healthy', changeType: stats.inventory.lowStock > 0 ? 'decrease' : 'neutral', icon: 'Package', color: 'warning' }
    ];
  }, [dashboardData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12">
            {/* Elite Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-black tracking-tight text-foreground leading-[1.1]"
                >
                  Global Command <br /> <span className="text-primary italic">Intelligence Center</span>
                </motion.h2>
                <p className="text-muted-foreground mt-4 font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">System Synchronized: {new Date().toLocaleTimeString('vi-VN')}</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="h-14 px-8 rounded-[1.5rem] border-border/30 glass-card font-black uppercase tracking-widest text-[10px]" iconName="Download">Export Report</Button>
                <Button className="h-14 px-8 rounded-[1.5rem] shadow-2xl shadow-primary/40 font-black uppercase tracking-widest text-[10px]" iconName="Plus" onClick={() => navigate('/admin-panel/products/new')}>New Asset</Button>
              </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statsLoading ? [...Array(4)].map((_, i) => <div key={i} className="h-44 bg-card/40 animate-pulse rounded-[2.5rem]" />) :
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
                <ModernSalesChart data={dashboardData?.revenueTrend || []} loading={statsLoading} onRetry={loadDashboardStats} />
                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
                  <ModernRecentOrders />
                  <TopProducts />
                </div>
              </motion.div>

              {/* Side Intelligence Center */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="xl:col-span-4 space-y-8"
              >
                <ModernQuickActions />
                <div className="glass-card rounded-[2.5rem] p-8 border-border/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black uppercase tracking-widest text-primary">Live Pulse</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-success">Real-time</span>
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