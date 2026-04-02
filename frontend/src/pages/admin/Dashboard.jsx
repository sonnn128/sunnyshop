import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service.js';
import { formatPrice } from '@/utils/format';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Button,
  Table,
  Tag,
  Avatar,
  Space,
  Progress,
  Spin,
  Alert,
  Divider
} from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { productService } from '../../services/product.service.js';
import { userService } from '../../services/user.service.js';
import { orderService } from '../../services/order.service.js';
import { categoryService } from '../../services/category.service.js';

const { Title, Text } = Typography;



const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalRevenue: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        statsRes,
        productsRes,
        usersRes,
        ordersRes,
        categoriesRes
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTopProducts(),
        userService.getAll(0, 5), // Keep using userService for recent users as we didn't make a specific endpoint or just reuse getAll
        dashboardService.getRecentOrders(),
        categoryService.getAll()
      ]);

      // Update stats
      setStats({
        totalProducts: statsRes.totalProducts || 0,
        totalUsers: statsRes.totalUsers || 0,
        totalOrders: statsRes.totalOrders || 0,
        totalCategories: statsRes.totalCategories || 0,
        totalRevenue: statsRes.totalRevenue || 0
      });

      // Update recent data
      setRecentProducts(productsRes || []);
      setRecentUsers(usersRes.data?.content || []); // usersRes is still Page<User>
      setRecentOrders(ordersRes || []);
      setCategories(categoriesRes.data || []);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const productColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar
            shape="square"
            size={40}
            src={record.image}
            icon={<ShoppingOutlined />}
          />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.categoryName || 'No Category'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatPrice(price),
    },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <Tag color={quantity > 10 ? 'green' : quantity > 0 ? 'orange' : 'red'}>
          {quantity || 0}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  const userColumns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space>
          {roles?.map(role => (
            <Tag key={role.id} color={role.id === 'ADMIN' ? 'red' : 'blue'}>
              {role.id}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id?.toString().slice(-8) || 'N/A'}`,
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.username || 'Guest',
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => formatPrice(amount),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'COMPLETED' ? 'green' : status === 'PENDING' ? 'orange' : 'red'}>
          {status || 'PENDING'}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Loading dashboard data...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Admin Dashboard
        </Title>
        <Text type="secondary">
          Welcome to the Sunny Shop Admin Panel
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Categories"
              value={stats.totalCategories}
              prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              formatter={(value) => formatPrice(value)}
              prefix={<DollarOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Data Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ShoppingOutlined />
                Recent Products
              </Space>
            }
            extra={<Button type="link" icon={<PlusOutlined />}>Add Product</Button>}
          >
            <Table
              columns={productColumns}
              dataSource={recentProducts}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                Recent Users
              </Space>
            }
            extra={<Button type="link" icon={<PlusOutlined />}>Add User</Button>}
          >
            <Table
              columns={userColumns}
              dataSource={recentUsers}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                Recent Orders
              </Space>
            }
            extra={<Button type="link">View All Orders</Button>}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* Categories Overview */}
      {categories.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <TrophyOutlined />
                  Categories Overview
                </Space>
              }
              extra={<Button type="link">Manage Categories</Button>}
            >
              <Row gutter={[16, 16]}>
                {categories.map(category => (
                  <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
                    <Card size="small" hoverable>
                      <div style={{ textAlign: 'center' }}>
                        <Avatar
                          size={48}
                          icon={<TrophyOutlined />}
                          style={{ marginBottom: 8 }}
                        />
                        <div>
                          <Text strong>{category.name}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {category.productCount || 0} products
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
