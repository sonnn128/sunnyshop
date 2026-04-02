import React from 'react';
import { Layout, Button, Dropdown, Avatar, Input, theme, Space, Badge } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LaptopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingOutlined,
  DashboardOutlined,
  BulbOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import CartIcon from '../CartIcon.jsx';

const { Header } = Layout;

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'My Orders',
      onClick: () => navigate('/orders')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const adminMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin')
    },
    {
      key: 'products',
      icon: <LaptopOutlined />,
      label: 'Products',
      onClick: () => navigate('/admin/products')
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'Orders',
      onClick: () => navigate('/admin/orders')
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/admin/users')
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 72, // Slightly taller for modern look
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: themeMode === 'light' ? '0 2px 8px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 1. Logo Section */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minWidth: 200 }}
        onClick={() => navigate('/')}
      >
        <div style={{
          width: 40,
          height: 40,
          background: token.colorPrimary,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 10px ${token.colorPrimary}66`
        }}>
          <LaptopOutlined style={{ color: '#fff', fontSize: 22 }} />
        </div>
        <div style={{
          fontSize: '20px',
          fontWeight: '800',
          color: token.colorPrimary,
          letterSpacing: '-0.5px'
        }}>
          Sunny Shop
        </div>
      </div>

      {/* 2. Navigation & Search Section */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
        {/* Nav Links */}
        <Space size="large" style={{ display: { xs: 'none', md: 'flex' } }}>
          <Button
            type="text"
            onClick={() => navigate('/')}
            style={{
              fontWeight: isActive('/') ? 'bold' : 'normal',
              color: isActive('/') ? token.colorPrimary : token.colorText
            }}
          >
            Home
          </Button>
          <Button
            type="text"
            onClick={() => navigate('/products')}
            style={{
              fontWeight: isActive('/products') ? 'bold' : 'normal',
              color: isActive('/products') ? token.colorPrimary : token.colorText
            }}
          >
            Products
          </Button>
        </Space>

        {/* Search Bar */}
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Input.Search
            placeholder="Search for laptops..."
            onSearch={(v) => navigate(`/products?search=${encodeURIComponent(v)}`)}
            allowClear
            size="large"
            style={{
              width: '100%',
            }}
            styles={{
              input: { borderRadius: '20px 0 0 20px' },
              button: { borderRadius: '0 20px 20px 0' }
            }}
          />
        </div>
      </div>

      {/* 3. Actions Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 200, justifyContent: 'flex-end' }}>
        <Space size="small">
          <Button
            type="text"
            icon={<HeartOutlined />}
            onClick={() => navigate('/wishlist')}
            style={{ color: token.colorText }}
            title="Favorites"
          />

          <CartIcon />

          <Button
            type="text"
            icon={<BulbOutlined />}
            onClick={() => {
              const nextMode = themeMode === 'light' ? 'dark' : (themeMode === 'dark' ? 'system' : 'light');
              setThemeMode(nextMode);
            }}
            style={{ color: token.colorText }}
            title={`Theme: ${themeMode}`}
          />
        </Space>

        <div style={{ width: 1, height: 24, background: token.colorBorderSecondary, margin: '0 8px' }} />

        {user ? (
          <>
            {isAdmin() && (
              <Dropdown menu={{ items: adminMenuItems }} placement="bottomRight">
                <Button type="text" style={{ color: token.colorText }}>
                  <SettingOutlined />
                </Button>
              </Dropdown>
            )}

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'background 0.3s', ':hover': { background: token.colorFillTertiary } }}>
                <Avatar
                  style={{ backgroundColor: token.colorPrimary, verticalAlign: 'middle' }}
                  icon={<UserOutlined />}
                  src={user.avatar} // Assuming user object might have an avatar property
                >
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: token.colorText }}>{user.fullName || user.username}</span>
                </div>
              </div>
            </Dropdown>
          </>
        ) : (
          <Space>
            <Button type="text" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
