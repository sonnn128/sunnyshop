import React, { useState, useEffect } from 'react';
import { Layout, Button, Dropdown, Avatar, Input, theme, Space, Badge } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  BulbOutlined,
  HeartOutlined,
  SkinOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import CartIcon from '../CartIcon.jsx';
import { categoryService } from '@/services/category.service.js';

const { Header } = Layout;

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAll().then(res => {
      setCategories(res?.data || res || []);
    }).catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      onClick: () => navigate('/profile')
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'Đơn hàng của tôi',
      onClick: () => navigate('/orders')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout
    }
  ];

  const adminMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan Admin',
      onClick: () => navigate('/admin')
    },
    {
      key: 'products',
      icon: <SkinOutlined />,
      label: 'Quản lý Sản phẩm',
      onClick: () => navigate('/admin/products')
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'Quản lý Đơn hàng',
      onClick: () => navigate('/admin/orders')
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Quản lý Người dùng',
      onClick: () => navigate('/admin/users')
    }
  ];

  const categoryMenu = {
    items: categories.map(cat => ({
      key: cat.id,
      label: cat.name,
      onClick: () => navigate(`/products?category=${encodeURIComponent(cat.name)}`)
    }))
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div style={{
        background: '#111827',
        color: '#fff',
        textAlign: 'center',
        padding: '8px 24px',
        fontSize: '13px',
        fontWeight: '500',
        letterSpacing: '0.5px'
      }}>
        ✨ MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN HÀNG TỪ 1.000.000₫ ✨
      </div>
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
          width: 44,
          height: 44,
          background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(17, 24, 39, 0.3)'
        }}>
          <SkinOutlined style={{ color: '#fff', fontSize: 24 }} />
        </div>
        <div style={{
          fontSize: '22px',
          fontWeight: '900',
          color: '#111827',
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
              fontWeight: isActive('/') ? 'bold' : '600',
              color: isActive('/') ? '#4F46E5' : token.colorText,
              fontSize: '15px',
              textTransform: 'uppercase'
            }}
          >
            Trang Chủ
          </Button>
          <Button
            type="text"
            onClick={() => navigate('/products')}
            style={{
              fontWeight: isActive('/products') ? 'bold' : '600',
              color: isActive('/products') ? '#4F46E5' : token.colorText,
              fontSize: '15px',
              textTransform: 'uppercase'
            }}
          >
            Sản Phẩm
          </Button>
          <Dropdown menu={categoryMenu} placement="bottomLeft">
            <Button
              type="text"
              style={{
                fontWeight: '600',
                color: token.colorText,
                fontSize: '15px',
                textTransform: 'uppercase'
              }}
            >
              Danh Mục
            </Button>
          </Dropdown>
          <Button
            type="text"
            onClick={() => navigate('/products')}
            style={{
              fontWeight: '600',
              color: token.colorText,
              fontSize: '15px',
              textTransform: 'uppercase'
            }}
          >
            Hàng Mới
          </Button>
          <Button
            type="text"
            onClick={() => navigate('/products')}
            style={{
              fontWeight: '600',
              color: '#EF4444',
              fontSize: '15px',
              textTransform: 'uppercase'
            }}
          >
            Khuyến Mãi
          </Button>
        </Space>


      </div>

      {/* 3. Actions Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 200, justifyContent: 'flex-end' }}>
        <Space size="small">
          <Button
            type="text"
            icon={<HeartOutlined style={{ fontSize: '20px' }} />}
            onClick={() => navigate('/wishlist')}
            style={{ color: token.colorText }}
            title="Yêu Thích"
          />

          <CartIcon style={{ color: token.colorText, fontSize: '20px' }} />

          <Button
            type="text"
            icon={<BulbOutlined style={{ fontSize: '20px' }} />}
            onClick={() => {
              const nextMode = themeMode === 'light' ? 'dark' : (themeMode === 'dark' ? 'system' : 'light');
              setThemeMode(nextMode);
            }}
            style={{ color: token.colorText }}
            title={`Giao diện: ${themeMode}`}
          />
        </Space>

        <div style={{ width: 1, height: 24, background: token.colorBorderSecondary, margin: '0 8px' }} />

        {user ? (
          <>
            {isAdmin() && (
              <Dropdown menu={{ items: adminMenuItems }} placement="bottomRight">
                <Button type="text" style={{ color: token.colorText }}>
                  <SettingOutlined style={{ fontSize: '20px' }} />
                </Button>
              </Dropdown>
            )}

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 12px', borderRadius: 8, transition: 'background 0.3s', ':hover': { background: token.colorFillTertiary } }}>
                <Avatar
                  style={{ backgroundColor: '#4F46E5', verticalAlign: 'middle' }}
                  icon={<UserOutlined />}
                  src={user.avatar}
                >
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: token.colorText }}>{user.fullName || user.username}</span>
                </div>
              </div>
            </Dropdown>
          </>
        ) : (
          <Space>
            <Button type="text" onClick={() => navigate('/login')} style={{ fontWeight: 600 }}>
              Đăng Nhập
            </Button>
            <Button type="primary" onClick={() => navigate('/register')} style={{ borderRadius: '20px', fontWeight: 600, backgroundColor: '#111827', border: 'none', padding: '0 24px' }}>
              Đăng Ký
            </Button>
          </Space>
        )}
      </div>
    </Header>
    </>
  );
};

export default Navbar;
