import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, theme, Breadcrumb, ConfigProvider } from 'antd';
import AdminHeader from './AdminHeader.jsx';
import './AdminLayout.css';
import {
  DashboardOutlined,
  SkinOutlined,
  UserOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  SafetyCertificateOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/products',
      icon: <SkinOutlined />,
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
      key: '/admin/coupons',
      icon: <GiftOutlined />,
      label: 'Coupons',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '/admin/permissions',
      icon: <SafetyCertificateOutlined />,
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
      { title: 'Quản trị', className: 'text-gray-500 font-medium' }
    ];

    if (pathSegments.length > 1) {
      const currentPage = pathSegments[1];
      const pageNames = {
        dashboard: 'Tổng quan',
        products: 'Sản phẩm',
        categories: 'Danh mục',
        orders: 'Đơn hàng',
        coupons: 'Mã giảm giá',
        users: 'Người dùng',
        permissions: 'Phân quyền',
        settings: 'Cài đặt'
      };

      if (pageNames[currentPage]) {
        breadcrumbItems.push({ title: pageNames[currentPage] });
      }
    }

    return breadcrumbItems;
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: '#ffffff',
            headerBg: '#ffffff',
            bodyBg: '#F3F4F6'
          },
          Menu: {
            itemBg: '#ffffff',
            itemSelectedBg: 'rgba(79, 70, 229, 0.1)',
            itemColor: '#4B5563',
            itemHoverColor: '#4F46E5',
            itemSelectedColor: '#4F46E5',
          }
        }
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={collapsed ? 0 : 250}
          width={250}
          style={{
            boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
            zIndex: 10
          }}
        >
          <div style={{
            height: 64,
            margin: '16px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: collapsed ? '20px' : '22px',
            letterSpacing: '-0.5px',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
          }}>
            {collapsed ? 'S.S' : 'Sunny Shop'}
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ padding: '0 12px', borderRight: 0 }}
          />
        </Sider>
        <Layout>
          <AdminHeader
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
          <Content
            className="admin-content"
            style={{
              margin: '24px',
              padding: 0,
              minHeight: 280,
              background: 'transparent',
              borderRadius: borderRadiusLG,
            }}
          >
            <div style={{ marginBottom: 24, padding: '16px 24px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
               <Breadcrumb items={getBreadcrumbItems()} />
            </div>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
