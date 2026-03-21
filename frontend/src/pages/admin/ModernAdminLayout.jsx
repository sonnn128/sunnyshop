import React, { useState, useMemo } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Divider } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined, DashboardOutlined, ShoppingCartOutlined, InboxOutlined, UnorderedListOutlined, GlobalOutlined, EnvironmentOutlined, MessageOutlined, BarChartOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '@/hooks/useRole';
import { useAuthStore } from '@/store/auth.store';
import { useNavigate } from 'react-router-dom';
import './modern-admin.css';

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
    ShoppingBag: <ShoppingCartOutlined />,
    Package: <InboxOutlined />,
    FolderTree: <UnorderedListOutlined />,
    Globe: <GlobalOutlined />,
    MapPin: <EnvironmentOutlined />,
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

  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || 'Quản trị';

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
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('rememberedUsername');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
        } catch (e) {
          // ignore storage errors
        }
        navigate('/homepage');
      }
    }
  ];

  return (
    <Layout className="modern-admin-shell" style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        collapsedWidth={88}
        className="modern-admin-sider"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}
      >
        <div className="modern-admin-brand">
          <div className="modern-admin-brand-title" style={{ fontSize: collapsed ? '16px' : '24px' }}>
            {collapsed ? 'SS' : 'SunnyShop'}
          </div>
          {!collapsed && <div className="modern-admin-brand-subtitle">Management</div>}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          items={menuItems}
          className="modern-admin-menu"
          style={{ border: 'none', marginTop: '16px' }}
          theme="light"
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 88 : 280,
          transition: 'margin-left 0.3s'
        }}
      >
        <Header
          className="modern-admin-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 72,
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}
        >
          <div className="modern-admin-header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px' }}
              className="modern-admin-collapse-btn"
            />

            <div className="modern-admin-title-wrap">
              <div className="modern-admin-page-title">{activeTabLabel}</div>
              <div className="modern-admin-page-subtitle">Bảng điều khiển quản trị</div>
            </div>
          </div>

          <div className="modern-admin-header-right">
            <div className="modern-admin-user-meta" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {roleLabels[role]} • {new Date().toLocaleDateString('vi-VN')}
              </div>
            </div>

            <Divider type="vertical" style={{ height: '32px' }} />

            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <Avatar
                size={40}
                src={currentUser.avatar}
                icon={!currentUser.avatar && <UserOutlined />}
                style={{ cursor: 'pointer', border: '2px solid #e2e8f0' }}
              />
            </Dropdown>
          </div>
        </Header>

        <Content
          className="modern-admin-content"
          style={{ minHeight: 'calc(100vh - 112px)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              className="modern-admin-content-inner"
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
