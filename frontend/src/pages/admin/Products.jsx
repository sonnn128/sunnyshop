import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { productService } from '../../services/product.service.js';
import { categoryService } from '../../services/category.service.js';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Typography,
  Card,
  Select,
  Image,
  Row,
  Col,
  Upload
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importData, setImportData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Mock data
  useEffect(() => {
    fetchProducts(1, 10);
    fetchCategories();
  }, []);

  const fetchProducts = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await productService.getAll({
        page: page - 1, // API is 0-indexed
        size: size
      });
      // console.log("DEBUG RESPONSE:", response);

      // Handle Page object response
      const data = response.data || response;
      if (data && data.content) {
        // It's a Page object
        setProducts(Array.isArray(data.content) ? data.content : []);

        // Check for totalElements at root or inside 'page' object
        const total = data.totalElements ?? data.page?.totalElements ?? 0;

        setPagination({
          current: page,
          pageSize: size,
          total: total
        });
      } else if (Array.isArray(data)) {
        // It's a direct array (fallback)
        setProducts(data);
        setPagination({
          current: 1,
          pageSize: data.length,
          total: data.length
        });
      } else {
        setProducts([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
      // Clear selection on page change or refresh
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error('Failed to fetch products from API');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    fetchProducts(newPagination.current, newPagination.pageSize);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleBulkDelete = async () => {
    try {
      await productService.bulkDelete(selectedRowKeys);
      message.success(`Deleted ${selectedRowKeys.length} products successfully`);
      setSelectedRowKeys([]);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Failed to delete products:', error);
      message.error('Failed to delete products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      // Ensure we always set an array
      const data = response.data || response;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Failed to fetch categories from API');
      setCategories([]);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      message.success('Product deleted successfully');
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error('Failed to delete product');
    }
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const formData = new FormData();

      // Extract image file if exists
      let imageFile = null;
      if (values.imageFile && values.imageFile.length > 0) {
        imageFile = values.imageFile[0].originFileObj;
      }

      // Create product object (without the file)
      const productData = {
        name: values.name,
        price: values.price,
        quantity: values.quantity,
        factory: values.factory,
        target: values.target,
        description: values.description,
        categoryId: values.categoryId,
        image: values.image
      };

      if (editingProduct && !imageFile) {
        productData.image = editingProduct.image;
      }

      formData.append('product', JSON.stringify(productData));

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
        message.success('Product updated successfully');
      } else {
        await productService.create(formData);
        message.success('Product created successfully');
      }
      setModalVisible(false);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Failed to save product:', error);
      message.error('Failed to save product');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleImport = async (file) => {
    setImportLoading(true);
    // Use dynamic import for xlsx to avoid install issues if not present
    let XLSX;
    try {
      XLSX = await import('xlsx');
    } catch (e) {
      message.error("Please run 'npm install xlsx' to enable this feature.");
      setImportLoading(false);
      return false;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate and Transform
        const transformedProducts = [];
        const errors = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          const categoryName = row['Category'];
          if (!categoryName) {
            errors.push(`Row ${i + 2}: Category is missing`);
            continue;
          }

          const category = categories.find(c => c.name.toLowerCase() === categoryName.toString().toLowerCase());
          if (!category) {
            errors.push(`Row ${i + 2}: Category '${categoryName}' not found`);
            continue;
          }

          transformedProducts.push({
            name: row['Name'],
            price: row['Price'],
            image: row['Image URL'] || row['Image'], // Handle both cases
            description: row['Description'],
            quantity: row['Quantity'],
            factory: row['Factory'],
            target: row['Target'],
            categoryId: category.id,
            categoryName: category.name // For display purposes
          });
        }

        if (errors.length > 0) {
          Modal.error({
            title: 'Validation Errors',
            content: (
              <div style={{ maxHeight: 400, overflow: 'auto' }}>
                {errors.map((err, idx) => <div key={idx}>{err}</div>)}
              </div>
            )
          });
          setImportLoading(false);
          return;
        }

        if (transformedProducts.length === 0) {
          message.warning("No valid products found in file");
          setImportLoading(false);
          return;
        }

        setImportData(transformedProducts);
      } catch (error) {
        console.error(error);
        message.error("Failed to parse file");
      } finally {
        setImportLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent upload default behavior
  };

  const submitImport = async () => {
    setImportLoading(true);
    try {
      await productService.bulkCreateJSON(importData);
      message.success(`Successfully imported ${importData.length} products`);
      setImportModalVisible(false);
      setImportData([]);
      fetchProducts(1, pagination.pageSize);
    } catch (error) {
      console.error(error);
      message.error("Failed to import products");
    } finally {
      setImportLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await productService.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      message.error('Failed to download template');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image
          width={60}
          height={60}
          src={image}
          alt="product"
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsZqBg+IkQAi4eNcY2FQ+gfQO8nX3GwQcbgx1j+BmFUpA4nXwDxKzToYG4ib/2//9nYGBgO8T8//9+4///v4sB3d9vGjD8HwD3FgLefG8sYgAAAAlwSFlzAAALEgAACxIB0t1+/AAAADh0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAADUlEQVQ4jWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
      render: (q) => q ?? 0,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'category',
      render: (name) => name || '',
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
            title="Are you sure you want to delete this product?"
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
          <Title level={2} style={{ margin: 0 }}>Products Management</Title>
          <Space>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`Are you sure you want to delete ${selectedRowKeys.length} items?`}
                onConfirm={handleBulkDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete Selected ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadTemplate}
            >
              Download Template
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => {
                setImportData([]);
                setImportModalVisible(true);
              }}
            >
              Import Excel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Add Product
            </Button>
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={products}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{editingProduct ? 'Edit Product' : 'Add New Product'}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
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
                label="Product Name"
                rules={[{ required: true, message: 'Please input product name!' }]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[{ required: true, message: 'Please select category!' }]}
              >
                <Select placeholder="Select category" showSearch>
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price ($)"
                rules={[{ required: true, message: 'Please input price!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Stock Quantity"
                rules={[{ required: true, message: 'Please input stock!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="imageFile"
            label="Product Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          {editingProduct && editingProduct.image && (
            <div style={{ marginBottom: 24 }}>
              <Typography.Text type="secondary">Current Image:</Typography.Text>
              <br />
              <Image
                width={100}
                src={editingProduct.image}
                style={{ marginTop: 8, borderRadius: 4 }}
              />
            </div>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="factory"
                label="Factory"
                rules={[{ required: true, message: 'Please input factory!' }]}
              >
                <Input placeholder="Enter factory name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="target"
                label="Target"
                rules={[{ required: true, message: 'Please input target!' }]}
              >
                <Input placeholder="Enter target audience" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter product description..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large" loading={submitLoading}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={importData.length > 0 ? `Preview Import (${importData.length} products)` : "Import Products from Excel"}
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false);
          setImportData([]);
        }}
        width={importData.length > 0 ? 1000 : 520}
        footer={importData.length > 0 ? (
          <Space>
            <Button onClick={() => setImportData([])}>Back to Upload</Button>
            <Button type="primary" onClick={submitImport} loading={importLoading}>
              Submit Import
            </Button>
          </Space>
        ) : null}
      >
        {importData.length > 0 ? (
          <Table
            dataSource={importData}
            rowKey={(record, index) => index}
            pagination={{ pageSize: 5 }}
            size="small"
            columns={[
              { title: 'Name', dataIndex: 'name' },
              { title: 'Category', dataIndex: 'categoryName' },
              { title: 'Price', dataIndex: 'price', render: (val) => formatPrice(val) },
              { title: 'Qty', dataIndex: 'quantity' },
              { title: 'Factory', dataIndex: 'factory' }
            ]}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p>Please download the template first to ensure correct format.</p>
            <Button
              onClick={handleDownloadTemplate}
              icon={<UploadOutlined rotate={180} />}
              style={{ marginBottom: 20 }}
            >
              Download Template
            </Button>

            <Upload.Dragger
              name="file"
              multiple={false}
              accept=".xlsx, .xls"
              beforeUpload={handleImport}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single upload. Strictly prohibit from uploading company data or other band files
              </p>
            </Upload.Dragger>
            {importLoading && <p style={{ marginTop: 10 }}>Parsing...</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;
