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
  SearchOutlined
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
      message.error('Failed to fetch users');
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
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      message.error('Failed to delete user');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id, values);
        message.success('User updated successfully');
      } else {
        await userService.create(values);
        message.success('User created successfully');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      message.error('Failed to save user');
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
        <Avatar icon={<UserOutlined />} />
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Full Name',
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || '-',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space>
          {roles?.map(role => (
            <Tag key={role.id} color={getRoleColor(role.id)}>
              {role.id}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      render: (_, record) => {
        const isAdmin = record.roles?.some(role => role.id === 'ADMIN');
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
            {!isAdmin && (
              <Popconfirm
                title="Are you sure you want to delete this user?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>Users Management</Title>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add User
              </Button>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="Search by username..."
                prefix={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={8}>
              <Select
                placeholder="Filter by role"
                style={{ width: '100%' }}
                value={searchRole}
                onChange={setSearchRole}
                allowClear
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
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10
              }));
            }
          }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: 'Please input username!' },
                  { min: 3, message: 'Username must be at least 3 characters!' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input email!' },
                  { type: 'email', message: 'Please input valid email!' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: 'Please input full name!' },
                  { min: 2, message: 'Full name must be at least 2 characters!' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
              >
                <Select placeholder="Select gender" allowClear>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleIds"
                label="Roles"
                rules={[{ required: true, message: 'Please select at least one role!' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select roles"
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
            label="Address"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;