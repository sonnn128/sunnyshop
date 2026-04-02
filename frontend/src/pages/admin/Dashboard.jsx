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
  Spin,
  Tooltip
} from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  SkinOutlined,
  TagsOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';
import { userService } from '../../services/user.service.js';
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

      const [
        statsRes,
        productsRes,
        usersRes,
        ordersRes,
        categoriesRes
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTopProducts(),
        userService.getAll(0, 5),
        dashboardService.getRecentOrders(),
        categoryService.getAll()
      ]);

      setStats({
        totalProducts: statsRes.totalProducts || 0,
        totalUsers: statsRes.totalUsers || 0,
        totalOrders: statsRes.totalOrders || 0,
        totalCategories: statsRes.totalCategories || 0,
        totalRevenue: statsRes.totalRevenue || 0
      });

      setRecentProducts(productsRes || []);
      setRecentUsers(usersRes.data?.content || []);
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
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar
            shape="square"
            size={48}
            src={record.image}
            icon={<SkinOutlined />}
            style={{ borderRadius: '8px', border: '1px solid #f0f0f0' }}
          />
          <div>
            <Text strong style={{ color: '#111827' }}>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.categoryName || 'Chưa phân loại'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Text strong>{formatPrice(price)}</Text>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <Tag color={quantity > 10 ? 'success' : quantity > 0 ? 'warning' : 'error'} style={{ borderRadius: '12px', padding: '2px 10px' }}>
          {quantity > 0 ? `${quantity} sản phẩm` : 'Hết hàng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} style={{ color: '#4F46E5' }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const userColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#F3F4F6', color: '#4F46E5' }}>
            {text.charAt(0).toUpperCase()}
          </Avatar>
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
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space>
          {roles?.map(role => (
            <Tag key={role.id} color={role.id === 'ADMIN' ? 'purple' : 'blue'} style={{ borderRadius: '12px' }}>
              {role.id}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  const orderColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text strong style={{ color: '#4F46E5' }}>#{id?.toString().slice(-8) || 'N/A'}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.username || 'Khách',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => formatPrice(amount),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'COMPLETED' ? 'success' : status === 'PENDING' ? 'warning' : 'error'} style={{ borderRadius: '12px', padding: '2px 10px' }}>
          {status || 'PENDING'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', height: '100%' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Đang tải dữ liệu tổng quan...</Text>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Tổng Doanh Thu', value: formatPrice(stats.totalRevenue), icon: <DollarOutlined />, color: '#10B981', bg: '#D1FAE5' },
    { title: 'Tổng Đơn Hàng', value: stats.totalOrders, icon: <ShoppingCartOutlined />, color: '#3B82F6', bg: '#DBEAFE' },
    { title: 'Tổng Sản Phẩm', value: stats.totalProducts, icon: <SkinOutlined />, color: '#8B5CF6', bg: '#EDE9FE' },
    { title: 'Khách Hàng', value: stats.totalUsers, icon: <UserOutlined />, color: '#F59E0B', bg: '#FEF3C7' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#111827' }}>
          Tổng quan
        </Title>
        <Text type="secondary" style={{ fontSize: '15px' }}>
          Chào mừng trở lại! Dưới đây là tình hình cửa hàng của bạn hôm nay.
        </Text>
      </div>

      {/* Stats Cards Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {statCards.map((stat, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card 
              bodyStyle={{ padding: '24px' }} 
              style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>{stat.title}</Text>
                  <Title level={3} style={{ margin: '8px 0 0 0', color: '#111827', fontWeight: 700 }}>
                    {stat.value}
                  </Title>
                </div>
                <div style={{ 
                  width: '48px', height: '48px', 
                  borderRadius: '12px', 
                  backgroundColor: stat.bg, 
                  color: stat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                 <ArrowUpOutlined style={{ color: '#10B981' }} />
                 <Text style={{ color: '#10B981', fontWeight: 600 }}>Tăng 12%</Text>
                 <Text type="secondary">so với tháng trước</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table Rows */}
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          <Card
            title={<Space style={{ fontWeight: 700, fontSize: '16px' }}><ClockCircleOutlined style={{ color: '#4F46E5' }}/> Đơn Hàng Gần Đây</Space>}
            extra={<Button type="link" style={{ color: '#4F46E5', fontWeight: 500 }}>Xem tất cả</Button>}
            style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            bodyStyle={{ padding: 0 }}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              rowKey="id"
              className="premium-table"
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            title={<Space style={{ fontWeight: 700, fontSize: '16px' }}><TagsOutlined style={{ color: '#F59E0B' }}/> Danh Mục Nổi Bật</Space>}
            style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', height: '100%' }}
          >
            {categories.slice(0, 5).map(cat => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                 <Space>
                    <div style={{ width: 40, height: 40, borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <TagsOutlined />
                    </div>
                    <div>
                      <Text strong style={{ color: '#111827' }}>{cat.name}</Text>
                      <br/>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{cat.productCount} sản phẩm</Text>
                    </div>
                 </Space>
                 <Button type="text" shape="circle" icon={<ArrowRightOutlined />} />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card
            title={<Space style={{ fontWeight: 700, fontSize: '16px' }}><SkinOutlined style={{ color: '#8B5CF6' }}/> Sản Phẩm Xu Hướng</Space>}
            extra={<Button type="link" icon={<PlusOutlined />} style={{ color: '#8B5CF6', fontWeight: 500 }}>Thêm Sản Phẩm</Button>}
            style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            bodyStyle={{ padding: 0 }}
          >
            <Table
              columns={productColumns}
              dataSource={recentProducts}
              pagination={false}
              rowKey="id"
              className="premium-table"
            />
          </Card>
        </Col>
      </Row>

      <style>{`
        .premium-table .ant-table-thead > tr > th {
          background: #F9FAFB;
          color: #6B7280;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #E5E7EB;
          padding: 16px 24px;
        }
        .premium-table .ant-table-tbody > tr > td {
          padding: 16px 24px;
          border-bottom: 1px solid #F3F4F6;
        }
        .premium-table .ant-table-tbody > tr:hover > td {
          background-color: #F9FAFB;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
