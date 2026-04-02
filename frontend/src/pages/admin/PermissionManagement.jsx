import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm
} from "antd";
import { PlusOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { getPermissions, addPermission, deletePermission } from "../../services/permissionService";

const { Title } = Typography;

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const data = await getPermissions();
      if (Array.isArray(data)) {
        setPermissions(data);
      } else if (data && Array.isArray(data.result)) {
        setPermissions(data.result);
      } else if (data && Array.isArray(data.data)) {
        setPermissions(data.data);
      } else {
        console.warn("Permissions data is not an array:", data);
        setPermissions([]);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      message.error("Failed to fetch permissions");
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (values) => {
    setSubmitLoading(true);
    try {
      await addPermission(values.name, values.description);
      message.success("Permission added successfully");
      setModalVisible(false);
      form.resetFields();
      fetchPermissions();
    } catch (error) {
      console.error("Failed to add permission:", error);
      message.error("Failed to add permission");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePermission(id);
      message.success("Permission deleted successfully");
      fetchPermissions();
    } catch (error) {
      console.error("Failed to delete permission:", error);
      message.error("Failed to delete permission");
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '20%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '20%',
      render: (text) => text ? new Date(text).toLocaleString('vi-VN') : '',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '20%',
      render: (text) => text ? new Date(text).toLocaleString('vi-VN') : '',
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Popconfirm
          title="Xóa quyền"
          description="Bạn có chắc muốn xóa quyền này không?"
          onConfirm={() => handleDelete(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger icon={<DeleteOutlined />} type="text">
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="permission-management">
      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Title level={2} style={{ margin: 0 }}>Quản lý quyền hạn</Title>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPermissions}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              Thêm mới
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={permissions}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} quyền`
          }}
        />
      </Card>

      <Modal
        title="Thêm quyền mới"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
        >
          <Form.Item
            name="name"
            label="Tên quyền"
            rules={[
              { required: true, message: 'Vui lòng nhập tên quyền!' },
              { min: 3, message: 'Tên phải có ít nhất 3 ký tự' }
            ]}
          >
            <Input placeholder="ví dụ: ROLE_MANAGER" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' }
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả cho quyền này" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                Tạo quyền
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagement;
