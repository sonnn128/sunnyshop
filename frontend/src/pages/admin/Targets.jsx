import React, { useState, useEffect } from 'react';
import { targetService } from '../../services/target.service.js';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Typography,
  Card,
  Image,
  Row,
  Col,
  Select,
  Upload,
  Badge
} from 'antd';

const { Option } = Select;
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const Targets = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    setLoading(true);
    try {
      const response = await targetService.getAll();
      const data = response.data || response;
      setTargets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch targets:', error);
      message.error('Tải danh sách đối tượng thất bại từ API');
      setTargets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTarget(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTarget(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await targetService.delete(id);
      message.success('Xóa đối tượng thành công');
      fetchTargets();
    } catch (error) {
      console.error('Failed to delete target:', error);
      message.error('Xóa đối tượng thất bại');
    }
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const formData = new FormData();

      let imageFile = null;
      if (values.imageFile && values.imageFile.length > 0) {
        imageFile = values.imageFile[0].originFileObj;
      }

      const { imageFile: ignored, ...targetInfo } = values;

      const targetData = {
        ...targetInfo,
        image: undefined
      };

      if (editingTarget && !imageFile) {
        targetData.image = editingTarget.image;
      }

      formData.append('target', JSON.stringify(targetData));

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      if (editingTarget) {
        await targetService.update(editingTarget.id, formData);
        message.success('Cập nhật đối tượng thành công');
      } else {
        await targetService.create(formData);
        message.success('Tạo đối tượng thành công');
      }
      setModalVisible(false);
      fetchTargets();
    } catch (error) {
      console.error('Failed to save target:', error);
      message.error('Lưu đối tượng thất bại');
    } finally {
      setSubmitLoading(false);
    }
  };


  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt="target"
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      ),
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#111827' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => text ? new Date(text).toLocaleDateString('vi-VN') : '',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ borderRadius: '8px' }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa đối tượng này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} style={{ borderRadius: '8px' }}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} bodyStyle={{ padding: 0 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Quản lý đối tượng (Target)</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ backgroundColor: '#4F46E5', borderRadius: '8px' }}
          >
            Thêm đối tượng
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={targets}
          loading={loading}
          rowKey="id"
          className="premium-table"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            style: { padding: '0 24px 24px 24px' }
          }}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700 }}>{editingTarget ? 'Sửa đối tượng' : 'Thêm đối tượng mới'}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
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
                name="name"
                label={<span style={{ fontWeight: 500 }}>Tên đối tượng</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên đối tượng!' }]}
              >
                <Input placeholder="VD: Sinh viên" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label={<span style={{ fontWeight: 500 }}>Đường dẫn (Slug)</span>}
                rules={[{ required: true, message: 'Vui lòng nhập đường dẫn!' }]}
              >
                <Input placeholder="VD: sinh-vien" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={<span style={{ fontWeight: 500 }}>Mô tả</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Mô tả về đối tượng..."
              showCount
              maxLength={200}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
            <Form.Item
              name="imageFile"
              label={<span style={{ fontWeight: 500 }}>Hình ảnh</span>}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e && e.fileList;
              }}
              style={{ marginBottom: 0 }}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                accept="image/*"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              </Upload>
            </Form.Item>

            {editingTarget && editingTarget.image && (
              <div style={{ textAlign: 'center', paddingTop: 30 }}>
                <div style={{ marginBottom: 8, fontSize: 12 }}>Ảnh hiện tại:</div>
                <Image
                  width={80}
                  height={80}
                  src={editingTarget.image}
                  alt="Current"
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>

          <Form.Item
            name="status"
            label={<span style={{ fontWeight: 500 }}>Trạng thái</span>}
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            initialValue="active"
          >
            <Select placeholder="Chọn trạng thái" size="large" style={{ borderRadius: '8px' }}>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Tạm ngưng</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)} size="large" style={{ borderRadius: '8px' }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large" loading={submitLoading} style={{ backgroundColor: '#4F46E5', borderRadius: '8px' }}>
                {editingTarget ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div >
  );
};

export default Targets;
