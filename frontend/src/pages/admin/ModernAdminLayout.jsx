import React, { useState, useMemo } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Divider } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined, DashboardOutlined, ShoppingBagOutlined, PackageOutlined, FolderTreeOutlined, GlobalOutlined, MapPinOutlined, MessageOutlined, BarChartOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../../hooks/useRole';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';

const { Sider, Header, Content } = Layout;

const ModernAdminLayout = ({ children, activeTab, onTabChange }) => {
  const { user, role } = useRole();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
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

  const iconMap = {
    LayoutDashboard: <DashboardOutlined />,
    ShoppingBag: <ShoppingBagOutlined />,
    Package: <PackageOutlined />,
    FolderTree: <FolderTreeOutlined />,
    Globe: <GlobalOutlined />,
    MapPin: <MapPinOutlined />,
    MessageCircle: <MessageOutlined />,
    BarChart3: <BarChartOutlined />,
    Users: <TeamOutlined />,
    Settings: <SettingOutlined />
  };

  const tabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'LayoutDashboard', roles: ['staff', 'manager', 'admin'] },
    { id: 'orders', label: 'Đơn hàng', icon: 'ShoppingBag', roles: ['staff', 'manager', 'admin'] },
    { id: 'products', label: 'Sản phẩm', icon: 'Package', roles: ['staff', 'manager', 'admin'] },
    { id: 'categories', label: 'Danh mục', icon: 'FolderTree', roles: ['staff', 'manager', 'admin'] },
    { id: 'brands', label: 'Thương hiệu', icon: 'Globe', roles: ['staff', 'manager', 'admin'] },
    { id: 'addresses', label: 'Địa chỉ', icon: 'MapPin', roles: ['admin'] },
    { id: 'chat', label: 'Tin nhắn', icon: 'MessageCircle', roles: ['staff', 'manager', 'admin'] },
    { id: 'analytics', label: 'Phân tích', icon: 'BarChart3', roles: ['manager', 'admin'] },
    { id: 'users', label: 'Khách hàng', icon: 'Users', roles: ['admin'] },
    { id: 'settings', label: 'Cài đặt', icon: 'Settings', roles: ['admin'] }
  ].filter(tab => tab.roles.includes(role));

  const menuItems = tabs.map(tab => ({
    key: tab.id,
    icon: iconMap[tab.icon],
    label: tab.label,
    onClick: () => onTabChange(tab.id)
  }));

  const userMenuItems = [
    {
      label: 'Hồ sơ',
      key: 'profile',
      onClick: () => navigate('/profile')
    },
    {
      label: 'Cài đặt',
      key: 'settings',
      onClick: () => navigate('/settings')
    },
    { type: 'divider' },
    {
      label: 'Đăng xuất',
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      }
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #135ba1 100%)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}
      >
        <div style={{ padding: '24px 16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: collapsed ? '16px' : '24px', fontWeight: 'bold', color: 'white' }}>
            {collapsed ? 'C' : 'Courtify'}
          </div>
          {!collapsed && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>Admin Panel</div>}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: '16px'
          }}
          itemLabelRender={(item) => (
            <span style={{ color: 'white', fontSize: '14px' }}>{item}</span>
          )}
          theme="dark"
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          transition: 'margin-left 0.3s'
        }}
      >
        <Header
          style={{
            background: 'white',
            padding: '0 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {roleLabels[role]} • {new Date().toLocaleDateString('vi-VN')}
              </div>
            </div>

            <Divider type="vertical" style={{ height: '32px' }} />

            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <Avatar
                size={40}
                src={currentUser.avatar}
                icon={!currentUser.avatar && <UserOutlined />}
                style={{ cursor: 'pointer' }}
              />
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 24px',
            padding: '24px',
            background: '#f5f5f5',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ModernAdminLayout;
