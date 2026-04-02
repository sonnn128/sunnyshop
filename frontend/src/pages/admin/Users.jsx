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
  InputNumber
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import { userService } from '../../services/user.service';

const { Title } = Typography;
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

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'username',
      key: 'avatar',
      width: 80,
      render: (username) => (
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#8B5CF6' }} />
      ),
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text) => <Typography.Text strong style={{ color: '#111827' }}>{text}</Typography.Text>
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || '-',
    },
    {
      title: 'Quyền',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space>
          {roles?.map(role => (
            <Tag key={role.id} color={getRoleColor(role.id)} style={{ borderRadius: '12px' }}>
              {role.id}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.isLocked ? 'error' : 'success'} style={{ borderRadius: '12px' }}>
          {record.isLocked ? 'Bị khóa' : 'Hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => {
        const isAdmin = record.roles?.some(role => role.id === 'ADMIN');
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ borderRadius: '6px' }}
            />
            {!isAdmin && (
              <>
                <Popconfirm
                  title={record.isLocked ? "Bạn muốn mở khóa tài khoản này?" : "Bạn muốn khóa tài khoản này?"}
                  onConfirm={() => handleToggleLock(record.id, record.isLocked)}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Button
                    type="primary"
                    warning={!record.isLocked}
                    size="small"
                    icon={record.isLocked ? <UnlockOutlined /> : <LockOutlined />}
                    style={{ borderRadius: '6px', backgroundColor: record.isLocked ? '#10B981' : '#F59E0B', border: 'none' }}
                  />
                </Popconfirm>
                <Popconfirm
                  title="Bạn có chắc muốn xóa người dùng này?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Button
                    type="primary"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    style={{ borderRadius: '6px' }}
                  />
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
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} bodyStyle={{ padding: 0 }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Quản lý người dùng</Title>
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
                placeholder="Tìm kiếm theo tên tài khoản..."
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

      <Modal
        title={<span style={{ fontWeight: 700 }}>{editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}</span>}
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