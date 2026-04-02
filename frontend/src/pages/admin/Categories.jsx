import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/category.service.js';
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
  Tag,
  Image,
  Row,
  Col,
  Select,
  Upload
} from 'antd';

const { Option } = Select;
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      // Ensure we always set an array
      const data = response.data || response;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Failed to fetch categories from API');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      message.error('Failed to delete category');
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const formData = new FormData();

      // Extract image file if exists
      let imageFile = null;
      if (values.imageFile && values.imageFile.length > 0) {
        imageFile = values.imageFile[0].originFileObj;
      }

      const { imageFile: ignored, ...categoryInfo } = values;

      // Prepare category data
      const categoryData = {
        ...categoryInfo,
        image: undefined // Default to undefined
      };

      // If editing and no new file, keep existing image
      if (editingCategory && !imageFile) {
        categoryData.image = editingCategory.image;
      }

      // Append category JSON
      formData.append('category', JSON.stringify(categoryData));

      // Append file if present
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        message.success('Category updated successfully');
      } else {
        await categoryService.create(formData);
        message.success('Category created successfully');
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      message.error('Failed to save category');
    } finally {
      setSubmitLoading(false);
    }
  };


  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt="category"
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
      render: (count) => (
        <Tag color="blue">{count} products</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            description="This action cannot be undone and will affect all products in this category."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Title level={2} style={{ margin: 0 }}>Categories Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Category
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{editingCategory ? 'Edit Category' : 'Add New Category'}</span>
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
                label="Category Name"
                rules={[{ required: true, message: 'Please input category name!' }]}
              >
                <Input placeholder="e.g., Gaming Laptops" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please input slug!' }]}
              >
                <Input placeholder="e.g., gaming-laptops" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe this category..."
              showCount
              maxLength={200}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
            <Form.Item
              name="imageFile"
              label="Category Image"
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
                beforeUpload={() => false} // Prevent auto upload
                accept="image/*"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            {editingCategory && editingCategory.image && (
              <div style={{ textAlign: 'center', paddingTop: 30 }}>
                <div style={{ marginBottom: 8, fontSize: 12 }}>Current:</div>
                <Image
                  width={80}
                  height={80}
                  src={editingCategory.image}
                  alt="Current"
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              </div>
            )}
          </div>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
            initialValue="active"
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large" loading={submitLoading}>
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div >
  );
};

export default Categories;
