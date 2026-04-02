import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Button, Avatar, Dropdown, Typography, Badge, Tooltip, theme } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './AdminLayout.css';

const { Header } = Layout;
const { Text } = Typography;

const AdminHeader = ({ collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, colorText, colorTextSecondary, colorBorderSecondary },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoHome = () => {
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
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => navigate('/admin/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      danger: true
    }
  ];

  return (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
        borderBottom: `1px solid ${colorBorderSecondary}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '64px',
        overflow: 'hidden'
      }}
    >
      <div className="header-left-section" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flex: '1 1 auto',
        minWidth: 0
      }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          style={{
            fontSize: '16px',
            width: 40,
            height: 40,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minWidth: 0,
          flex: '1 1 auto'
        }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              flexShrink: 0
            }}
          >
            SS
          </div>
          <div style={{ minWidth: 0 }}>
            <Text
              strong
              className="header-title-text"
              style={{
                fontSize: '18px',
                color: colorText,
                display: 'block',
                lineHeight: '1.2'
              }}
            >
              Quản trị Sunny Shop
            </Text>
            <Text
              type="secondary"
              className="header-title-text"
              style={{
                fontSize: '12px',
                color: colorTextSecondary,
                display: 'block',
                lineHeight: '1.2'
              }}
            >
              Bảng điều khiển Quản trị
            </Text>
          </div>
        </div>
      </div>

      <div className="header-right-section" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <Tooltip title="Trang chủ Website">
          <Button
            type="text"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            style={{
              color: '#1890ff',
              width: 40,
              height: 40,
              padding: 0
            }}
          />
        </Tooltip>

        <Tooltip title="Thông báo">
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
                padding: 0
              }}
            />
          </Badge>
        </Tooltip>

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            className="header-user-section"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              borderRadius: 8,
              height: 'auto',
              border: 'none',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff', flexShrink: 0 }}
            />
            <div style={{
              textAlign: 'left'
            }}>
              <Text
                strong
                className="header-user-text"
                style={{
                  fontSize: '14px',
                  color: colorText,
                  display: 'block'
                }}
              >
                {user?.username || 'Admin'}
              </Text>
              <Text
                type="secondary"
                className="header-user-text"
                style={{
                  fontSize: '12px',
                  color: colorTextSecondary,
                  display: 'block'
                }}
              >
                Quản trị viên
              </Text>
            </div>
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};

AdminHeader.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default AdminHeader;
