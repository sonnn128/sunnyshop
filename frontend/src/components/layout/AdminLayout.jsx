import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, theme, Breadcrumb } from 'antd';
import AdminHeader from './AdminHeader.jsx';
import './AdminLayout.css';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TagsOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: '/admin/categories',
      icon: <TagsOutlined />,
      label: 'Categories',
    },
    {
      key: '/admin/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '/admin/permissions',
      icon: <SettingOutlined style={{color: '#faad14'}} />, // dùng icon SettingOutlined, có thể thay bằng icon khác nếu muốn
      label: 'Permissions',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      { title: 'Admin' }
    ];

    if (pathSegments.length > 1) {
      const currentPage = pathSegments[1];
      const pageNames = {
        dashboard: 'Dashboard',
        products: 'Products',
        categories: 'Categories',
        orders: 'Orders',
        users: 'Users',
        permissions: 'Permissions',
        settings: 'Settings'
      };

      if (pageNames[currentPage]) {
        breadcrumbItems.push({ title: pageNames[currentPage] });
      }
    }

    return breadcrumbItems;
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={collapsed ? 0 : 200}
        style={{
          background: colorBgContainer,
        }}
      >
        <div style={{
          height: 40,
          margin: 16,
          background: theme.useToken().token.colorPrimary,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: collapsed ? '16px' : '14px'
        }}>
          {collapsed ? 'SS' : 'Sunny Shop Admin'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <AdminHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="admin-content"
        >
          <Breadcrumb
            items={getBreadcrumbItems()}
            style={{ marginBottom: 16 }}
          />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
