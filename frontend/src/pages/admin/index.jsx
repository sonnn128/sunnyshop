import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import API from '@/lib/api';
import { Row, Col, Card, Button, Space, Statistic, Spin, Empty, Tag, Divider } from 'antd';
import { DownloadOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
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
import AddressList from './addresses/AddressList';
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
    navigate(`/admin?tab=${tabId}`, { replace: true });
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                  Tổng quan <span style={{ fontStyle: 'italic', color: '#999' }}>điều hành</span>
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#52c41a',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    Đã đồng bộ: {new Date().toLocaleTimeString('vi-VN')}
                  </span>
                </div>
              </div>
              <Space>
                <Button icon={<DownloadOutlined />} size="large">
                  Xuất báo cáo
                </Button>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/admin?tab=products&create=1')}>
                  Thêm sản phẩm
                </Button>
              </Space>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {statsLoading ? (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                  <Spin />
                </div>
              ) : (
                <Row gutter={[16, 16]}>
                  {statsData.map((stat, i) => (
                    <Col xs={24} sm={12} lg={6} key={i}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card
                          style={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            height: '100%'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ fontSize: '14px', color: '#999' }}>{stat.title}</div>
                            <Tag
                              icon={stat.changeType === 'increase' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                              color={stat.changeType === 'increase' ? 'green' : stat.changeType === 'decrease' ? 'red' : 'default'}
                            >
                              {stat.change}
                            </Tag>
                          </div>
                          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#000' }}>
                            {stat.value}
                          </div>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              )}
            </motion.div>

            {/* Main Content Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Row gutter={[16, 16]}>
                {/* Left Column - Charts */}
                <Col xs={24} lg={16}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Card
                      title="Đơn hàng gần đây"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                      <ModernRecentOrders />
                    </Card>
                    <Card
                      title="Sản phẩm bán chạy"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                      <TopProducts />
                    </Card>
                  </div>
                </Col>

                {/* Right Column - Sidebar */}
                <Col xs={24} lg={8}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Card
                      title="Thao tác nhanh"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                      <ModernQuickActions />
                    </Card>
                    <Card
                      title="Hoạt động gần đây"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', color: '#999' }}>THỜI GIAN THỰC</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#52c41a',
                              animation: 'pulse 2s infinite'
                            }}
                          />
                          <span style={{ fontSize: '11px', color: '#52c41a' }}>ĐANG HOẠT ĐỘNG</span>
                        </div>
                      </div>
                      <ModernActivityFeed />
                    </Card>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </div>
        );
      case 'orders': return <OrdersList />;
      case 'products': return <ProductsList />;
      case 'categories': return <CategoryList />;
      case 'brands': return <BrandList />;
      case 'addresses': return <AddressList />;
      case 'chat': return <ChatManagement />;
      case 'users': return <UsersList />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'settings': return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card
            style={{
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Empty
              description="Cài đặt hệ thống"
              style={{ marginBottom: '24px' }}
            />
            <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Đang phát triển</h3>
            <p style={{ color: '#999', marginTop: '12px' }}>
              Tính năng cài đặt sẽ sớm được cập nhật. Vui lòng liên hệ quản trị viên hệ thống.
            </p>
          </Card>
        </motion.div>
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