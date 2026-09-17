import React, { useState, useEffect } from 'react';
import {
  Table,
  Space,
  Typography,
  Card,
  Tag,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Tooltip,
  Descriptions,
  Divider,
  Spin
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { userService } from '../../services/user.service';
import { orderService } from '../../services/order.service';
import { formatPrice } from '@/utils/format';

const { Title, Text } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Customer order history modal state
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Available roles
  const availableRoles = [
    { id: 'ADMIN', name: 'Admin' },
    { id: 'USER', name: 'User' }
  ];

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, searchKeyword, searchRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        keyword: searchKeyword || undefined,
        role: searchRole || undefined
      };

      const response = await userService.search(searchKeyword, searchRole, params);

      if (response.content) {
        // Handle Page object
        setUsers(response.content);
        setPagination(prev => ({
          ...prev,
          total: response.totalElements || 0
        }));
      } else {
        // Handle direct array
        setUsers(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Tải dữ liệu người dùng thất bại');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      roleIds: user.roles?.map(role => role.id) || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await userService.delete(id);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      message.error('Xóa người dùng thất bại');
    }
  };

  const handleToggleLock = async (id, currentStatus) => {
    try {
      await userService.toggleLock(id);
      message.success(currentStatus ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle lock user:', error);
      message.error('Thực hiện thất bại');
    }
  };

  const handleViewOrderHistory = async (user) => {
    setSelectedCustomer(user);
    setOrderModalVisible(true);
    setLoadingOrders(true);
    try {
      const orders = await orderService.getOrdersByUserId(user.id);
      setCustomerOrders(Array.isArray(orders) ? orders : []);
    } catch (error) {
      console.error('Failed to load customer orders:', error);
      message.error('Không thể tải lịch sử đơn hàng của khách');
      setCustomerOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id, values);
        message.success('Cập nhật người dùng thành công');
      } else {
        await userService.create(values);
        message.success('Tạo người dùng thành công');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      message.error('Lưu người dùng thất bại');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'USER': return 'blue';
      default: return 'default';
    }
  };

  const getOrderStatusColor = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'COMPLETED': return 'green';
      case 'SHIPPED': return 'blue';
      case 'PROCESSING': return 'orange';
      case 'PENDING': return 'gold';
      case 'CANCELLED': case 'CANCELED': return 'red';
      default: return 'default';
    }
  };

  // Summary statistics calculations
  const totalCustomers = pagination.total || users.length;
  const purchasingCustomers = users.filter(u => (u.totalOrders || 0) > 0).length;
  const totalOrdersPlaced = users.reduce((acc, u) => acc + (u.totalOrders || 0), 0);
  const totalCustomerSpending = users.reduce((acc, u) => acc + (u.totalSpent || 0), 0);

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'username',
      key: 'avatar',
      width: 70,
      render: (username, record) => (
        <Avatar
          icon={<UserOutlined />}
          style={{
            backgroundColor: record.roles?.some(r => r.id === 'ADMIN') ? '#EF4444' : '#6366F1'
          }}
        />
      ),
    },
    {
      title: 'Tài khoản & Khách hàng',
      key: 'userInfo',
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#111827', fontSize: '14px', display: 'block' }}>
            {record.fullName || record.username}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            @{record.username}
          </Text>
        </div>
      ),
      sorter: (a, b) => (a.fullName || a.username).localeCompare(b.fullName || b.username),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '13px', color: '#374151' }}>{record.email}</div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>{record.phone || 'Chưa cập nhật SĐT'}</div>
        </div>
      ),
    },
    {
      title: 'Quyền',
      dataIndex: 'roles',
      key: 'roles',
      width: 90,
      render: (roles) => (
        <Space>
          {roles?.map(role => (
            <Tag key={role.id} color={getRoleColor(role.id)} style={{ borderRadius: '12px', fontWeight: 600 }}>
              {role.id}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Đã mua (Hàng / Đơn)',
      key: 'ordersPurchased',
      align: 'center',
      render: (_, record) => {
        const orderCount = record.totalOrders || 0;
        const itemCount = record.totalProductsPurchased || 0;
        return (
          <div>
            {orderCount > 0 ? (
              <Tooltip title={`Đã mua ${itemCount} sản phẩm qua ${orderCount} đơn hàng`}>
                <Tag color="cyan" style={{ borderRadius: '12px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }} onClick={() => handleViewOrderHistory(record)}>
                  {orderCount} đơn {itemCount > 0 && `(${itemCount} SP)`}
                </Tag>
              </Tooltip>
            ) : (
              <span style={{ color: '#9CA3AF', fontSize: '13px' }}>0 đơn</span>
            )}
          </div>
        );
      },
      sorter: (a, b) => (a.totalOrders || 0) - (b.totalOrders || 0),
    },
    {
      title: 'Tổng chi tiêu',
      key: 'totalSpent',
      align: 'right',
      render: (_, record) => {
        const spent = record.totalSpent || 0;
        return (
          <Text strong style={{ color: spent > 0 ? '#059669' : '#9CA3AF', fontSize: '13px' }}>
            {spent > 0 ? formatPrice(spent) : '0 ₫'}
          </Text>
        );
      },
      sorter: (a, b) => (a.totalSpent || 0) - (b.totalSpent || 0),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 110,
      render: (_, record) => (
        <Tag color={record.isLocked ? 'error' : 'success'} style={{ borderRadius: '12px' }}>
          {record.isLocked ? 'Bị khóa' : 'Hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => {
        const isAdmin = record.roles?.some(role => role.id === 'ADMIN');
        return (
          <Space size="small">
            <Tooltip title="Xem lịch sử đơn hàng">
              <Button
                type="default"
                size="small"
                icon={<HistoryOutlined style={{ color: '#4F46E5' }} />}
                onClick={() => handleViewOrderHistory(record)}
                style={{ borderRadius: '6px', borderColor: '#C7D2FE', backgroundColor: '#EEF2FF' }}
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa thông tin">
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                style={{ borderRadius: '6px', backgroundColor: '#4F46E5' }}
              />
            </Tooltip>
            {!isAdmin && (
              <>
                <Popconfirm
                  title={record.isLocked ? "Bạn muốn mở khóa tài khoản này?" : "Bạn muốn khóa tài khoản này?"}
                  onConfirm={() => handleToggleLock(record.id, record.isLocked)}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Tooltip title={record.isLocked ? "Mở khóa" : "Khóa tài khoản"}>
                    <Button
                      type="primary"
                      size="small"
                      icon={record.isLocked ? <UnlockOutlined /> : <LockOutlined />}
                      style={{ borderRadius: '6px', backgroundColor: record.isLocked ? '#10B981' : '#F59E0B', border: 'none' }}
                    />
                  </Tooltip>
                </Popconfirm>
                <Popconfirm
                  title="Bạn có chắc muốn xóa người dùng này?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Tooltip title="Xóa người dùng">
                    <Button
                      type="primary"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{ borderRadius: '6px' }}
                    />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      {/* Summary Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)' }}>
            <Statistic
              title={<span style={{ color: '#4338CA', fontWeight: 600 }}>Tổng khách hàng</span>}
              value={totalCustomers}
              prefix={<UserOutlined style={{ color: '#4F46E5', marginRight: 8 }} />}
              valueStyle={{ color: '#312E81', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' }}>
            <Statistic
              title={<span style={{ color: '#047857', fontWeight: 600 }}>Khách đã mua hàng</span>}
              value={purchasingCustomers}
              prefix={<CheckCircleOutlined style={{ color: '#10B981', marginRight: 8 }} />}
              valueStyle={{ color: '#064E3B', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}>
            <Statistic
              title={<span style={{ color: '#1D4ED8', fontWeight: 600 }}>Tổng số đơn khách đặt</span>}
              value={totalOrdersPlaced}
              prefix={<ShoppingCartOutlined style={{ color: '#3B82F6', marginRight: 8 }} />}
              valueStyle={{ color: '#1E3A8A', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)' }}>
            <Statistic
              title={<span style={{ color: '#C2410C', fontWeight: 600 }}>Tổng chi tiêu khách hàng</span>}
              value={formatPrice(totalCustomerSpending)}
              prefix={<DollarOutlined style={{ color: '#F97316', marginRight: 8 }} />}
              valueStyle={{ color: '#7C2D12', fontWeight: 700, fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} bodyStyle={{ padding: 0 }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Quản lý người dùng & Khách hàng</Title>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Thống kê số lượng hàng mua, đơn đặt và tổng chi tiêu của từng khách hàng
              </Text>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{ backgroundColor: '#4F46E5', borderRadius: '8px' }}
              >
                Thêm người dùng
              </Button>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="Tìm kiếm theo tên tài khoản, họ tên..."
                prefix={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                allowClear
                size="large"
                style={{ borderRadius: '8px' }}
              />
            </Col>
            <Col span={8}>
              <Select
                placeholder="Lọc theo quyền"
                style={{ width: '100%' }}
                value={searchRole}
                onChange={setSearchRole}
                allowClear
                size="large"
              >
                {availableRoles.map(role => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          className="premium-table"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10
              }));
            },
            style: { padding: '0 24px 24px 24px' }
          }}
        />
      </Card>

      {/* Customer Order History Modal */}
      <Modal
        title={
          <Space>
            <HistoryOutlined style={{ color: '#4F46E5', fontSize: '18px' }} />
            <span style={{ fontWeight: 700, fontSize: '16px' }}>
              Lịch sử mua hàng: {selectedCustomer?.fullName || selectedCustomer?.username}
            </span>
          </Space>
        }
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        footer={null}
        width={850}
        styles={{
          header: { borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }
        }}
      >
        {selectedCustomer && (
          <div style={{ marginTop: 12 }}>
            <Descriptions size="small" bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Khách hàng">{selectedCustomer.fullName || selectedCustomer.username}</Descriptions.Item>
              <Descriptions.Item label="Tài khoản">@{selectedCustomer.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedCustomer.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedCustomer.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{selectedCustomer.address || '-'}</Descriptions.Item>
              <Descriptions.Item label="Thống kê chi tiêu">
                <Text strong style={{ color: '#059669' }}>
                  {formatPrice(selectedCustomer.totalSpent || 0)} ({selectedCustomer.totalOrders || 0} đơn)
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0 12px 0' }}>Danh sách đơn hàng đã đặt</Divider>

            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <Spin tip="Đang tải dữ liệu đơn hàng..." />
              </div>
            ) : customerOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#9CA3AF' }}>
                Khách hàng này chưa phát sinh đơn hàng nào.
              </div>
            ) : (
              <Table
                dataSource={customerOrders}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Mã đơn',
                    dataIndex: 'id',
                    key: 'id',
                    render: (id) => <Text strong style={{ color: '#4F46E5' }}>#{id}</Text>
                  },
                  {
                    title: 'Ngày đặt',
                    dataIndex: 'orderDate',
                    key: 'orderDate',
                    render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '-'
                  },
                  {
                    title: 'Sản phẩm đã mua',
                    key: 'products',
                    render: (_, record) => (
                      <div>
                        {record.orderDetails?.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 2 }}>
                            <span style={{ fontWeight: 500 }}>• {item.product?.name || 'Sản phẩm'}</span>
                            <Tag size="small" color="default" style={{ fontSize: '10px', padding: '0 4px', lineHeight: '16px' }}>
                              x{item.quantity} {item.size && `| Size ${item.size}`} {item.color && `| ${item.color}`}
                            </Tag>
                          </div>
                        ))}
                      </div>
                    )
                  },
                  {
                    title: 'Tổng tiền',
                    dataIndex: 'totalPrice',
                    key: 'totalPrice',
                    align: 'right',
                    render: (price) => <Text strong style={{ color: '#EA580C' }}>{formatPrice(price)}</Text>
                  },
                  {
                    title: 'Thanh toán',
                    dataIndex: 'paymentMethod',
                    key: 'paymentMethod',
                    align: 'center',
                    render: (pm) => <Tag color="geekblue">{pm || 'COD'}</Tag>
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    key: 'status',
                    align: 'center',
                    render: (status) => (
                      <Tag color={getOrderStatusColor(status)} style={{ borderRadius: '10px', fontWeight: 600 }}>
                        {status}
                      </Tag>
                    )
                  }
                ]}
              />
            )}
          </div>
        )}
      </Modal>

      {/* Edit / Create User Modal */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>{editingUser ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label={<span style={{ fontWeight: 500 }}>Tên tài khoản</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập tên tài khoản!' },
                  { min: 3, message: 'Tên tài khoản phải có ít nhất 3 ký tự!' }
                ]}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label={<span style={{ fontWeight: 500 }}>Email</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
                ]}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label={<span style={{ fontWeight: 500 }}>Họ và tên</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={<span style={{ fontWeight: 500 }}>Số điện thoại</span>}
              >
                <Input size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label={<span style={{ fontWeight: 500 }}>Giới tính</span>}
              >
                <Select placeholder="Chọn giới tính" allowClear size="large" style={{ borderRadius: '8px' }}>
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleIds"
                label={<span style={{ fontWeight: 500 }}>Quyền</span>}
                rules={[{ required: true, message: 'Vui lòng chọn ít nhất một quyền!' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn quyền"
                  size="large"
                  style={{ borderRadius: '8px' }}
                >
                  {availableRoles.map(role => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label={<span style={{ fontWeight: 500 }}>Địa chỉ</span>}
          >
            <Input.TextArea rows={3} style={{ borderRadius: '8px' }} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 500 }}>Mật khẩu</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password size="large" style={{ borderRadius: '8px' }} />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)} size="large" style={{ borderRadius: '8px' }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large" style={{ backgroundColor: '#4F46E5', borderRadius: '8px' }}>
                {editingUser ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;